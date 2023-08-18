import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

import { notify } from "../utils/notifications";
import { getServices } from "../api";
import { isServerSet } from "../utils/settingsStorage";
import { Service } from "../models";

const TASK_NAME = "background-refresh";
const LAST_SERVICE_UPDATE_KEY = "service-last-update";
const NOTIFIED_FOR_OFFLINE_KEY = "server-offline";


async function hasNotifiedForOffline() {
  return AsyncStorage.getItem(NOTIFIED_FOR_OFFLINE_KEY)
}

async function setNotifiedForOffline() {
  await AsyncStorage.setItem(NOTIFIED_FOR_OFFLINE_KEY, "true")
}

async function getServiceLastUpdate(id: string) {
  const service = await AsyncStorage.getItem(LAST_SERVICE_UPDATE_KEY + id)
  if (service)
    return JSON.parse(service) as Service
}

async function setServiceLastUpdate(service: Service) {
  await AsyncStorage.setItem(LAST_SERVICE_UPDATE_KEY + service.id, JSON.stringify(service))
}

TaskManager.defineTask(TASK_NAME, async () => {
  // Do nothing if no Internet or no Server configured.  
  const { isInternetReachable } = await NetInfo.fetch()
  if (!isInternetReachable || !await isServerSet())
    return BackgroundFetch.BackgroundFetchResult.NoData

  try {
    const services = await getServices();

    for (const service of services) {
      const last_update = await getServiceLastUpdate(service.id)
      if (last_update?.status !== service.status || last_update.message !== service.message)
        notify(`${service.label}: ${service.status}`, service.message || "");
      setServiceLastUpdate(service)
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

  } catch (error) {
    if (!await hasNotifiedForOffline()) {
      notify("Server unreachable.", "Whether the server or the API is not responding, check your server.");
      setNotifiedForOffline()
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