import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    priority: Notifications.AndroidNotificationPriority.MAX,
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function initializeNotifications() {
  await Notifications.setNotificationChannelAsync("Default", {
    enableLights: true,
    enableVibrate: true,
    importance: Notifications.AndroidImportance.MAX,
    name: "default",
    sound: "default",
    lightColor: "blue",
    vibrationPattern: [0, 250, 250, 250]
  })

  const { granted } = await Notifications.getPermissionsAsync()
  if (!granted) await Notifications.requestPermissionsAsync()
}

export async function notify(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body
    },
    trigger: null,
  })
}
