import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

import { notify } from "../utils/notifications";
import { getServices } from "../api";
import { isServerSet } from "../utils/settingsStorage";

const TASK_NAME = "background-refresh";
const STATUS_STORAGE_KEY = "status";

type Status = "error" | "failure" | "warning" | "update" | "ok"

async function getStatus() {
  const status = await AsyncStorage.getItem(STATUS_STORAGE_KEY)
  if (status)
    return status as Status
  else return "ok"
}

async function setStatus(status: Status) {
  await AsyncStorage.setItem(STATUS_STORAGE_KEY, status)
}

TaskManager.defineTask(TASK_NAME, async () => {
  const { isInternetReachable } = await NetInfo.fetch()

  if (!isInternetReachable || !await isServerSet())
    return BackgroundFetch.BackgroundFetchResult.NoData

  try {
    const services = await getServices();

    if (JSON.stringify(services).includes("update")) {
      if (await getStatus() != "update") {
        notify("Update", "There are some updates available on your server.");
        setStatus("update")
      }
    }
    else if (JSON.stringify(services).includes("warning")) {
      if (await getStatus() != "warning") {
        notify("Warning!", "Something needs attention on your server.");
        setStatus("warning")
      }
    }
    else if (JSON.stringify(services).includes("failure")) {
      if (await getStatus() != "failure") {
        notify("Failure!", "There is a critical failure on your server.");
        setStatus("failure")
      }
    }
    else if (await getStatus() != "ok") {
      notify("All good", "Your server is up-to-date and all services are running.");
      setStatus("ok")
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    if (await getStatus() != "error") {
      notify("Connection lost!", "Your server is unreachable.");
      setStatus("error")
    }
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundRefreshTask() {
  return BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 1 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterBackgroundRefreshTask() {
  return BackgroundFetch.unregisterTaskAsync(TASK_NAME);
}

export async function isBackgroundRefreshRegistered() {
  return TaskManager.isTaskRegisteredAsync(TASK_NAME);
}