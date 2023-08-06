import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import NetInfo from "@react-native-community/netinfo";

import { notify } from "../utils/notifications";
import { getServices } from "../api";

export const TASK_NAME = "background-refresh";

let status: "error" | "failure" | "warning" | "update" | "ok" = "ok"

TaskManager.defineTask(TASK_NAME, async () => {
  const { isInternetReachable } = await NetInfo.fetch()

  if (!isInternetReachable)
    return BackgroundFetch.BackgroundFetchResult.NoData

  try {
    const services = await getServices();

    if (JSON.stringify(services).includes("update")) {
      if (status != "update") {
        notify("Update", "There are some updates available on your server.");
        status = "update"
      }
    }
    else if (JSON.stringify(services).includes("warning")) {
      if (status != "warning") {
        notify("Warning!", "Something needs attention on your server.");
        status = "warning"
      }
    }
    else if (JSON.stringify(services).includes("failure")) {
      if (status != "failure") {
        notify("Failure!", "There is a critical failure on your server.");
        status = "failure"
      }
    }
    else if (status != "ok") {
      notify("All good", "Your server is up-to-date and all services are running.");
      status = "ok"
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    if (status != "error") {
      notify("Connection lost!", "Your server is unreachable.");
      status = "error"
    }
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundRefreshTaskAsync() {
  return BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 1 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterBackgroundRefreshTaskAsync() {
  return BackgroundFetch.unregisterTaskAsync(TASK_NAME);
}
