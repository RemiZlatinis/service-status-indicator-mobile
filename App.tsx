import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";

import { ServicesScreen, SettingsScreen } from "./screens";
import { useServices } from "./hooks";
import { registerBackgroundRefreshTask, unregisterBackgroundRefreshTask } from "./tasks/backgroundRefreshTask";
import { isFirstLaunch } from "./utils";
import { initializeNotifications } from "./utils/notifications";
import { isServerSet } from "./utils/settingsStorage";

SplashScreen.preventAutoHideAsync();

const server = require("./assets/status/server.png");
const serverOk = require("./assets/status/server-ok.png");
const serverError = require("./assets/status/server-error.png");

export default function App() {
  const [settingsMode, setSettingsMode] = useState(false);
  const { services, loading, serverDisconnected } = useServices();

  const initialize = async () => {
    if (await isFirstLaunch())
      Alert.alert(
        "Recommended actions (Manually)",
        "- Enable Autostart permissions\n- Disable battery optimizations (This enables background notification)"
      );

    await initializeNotifications();

    try {
      await unregisterBackgroundRefreshTask();
      await registerBackgroundRefreshTask();
    } catch (error) {
      Alert.alert("Error on task registering", (error as Error).message);
    }
  };

  const handleSplashScreen = async () => {
    if (!(await isServerSet()) || serverDisconnected !== undefined)
      SplashScreen.hideAsync();
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    handleSplashScreen();
  }, [serverDisconnected]);

  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        <StatusBar />
        <Image
          style={styles.statusLogo}
          source={
            serverDisconnected === undefined
              ? server
              : serverDisconnected
              ? serverError
              : serverOk
          }
          resizeMode="contain"
        />
        {serverDisconnected === undefined && (
          <Text style={{ marginRight: "auto" }}>No configured server</Text>
        )}
        <Ionicons
          name={settingsMode ? "close-circle" : "settings"}
          size={30}
          color="#CBD5E0"
          onPress={() => setSettingsMode(!settingsMode)}
        />
      </View>
      {settingsMode ? (
        <SettingsScreen />
      ) : (
        <ServicesScreen services={services} loading={loading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  nav: {
    height: 80,
    flexDirection: "row",
    backgroundColor: "#4A5568",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  statusLogo: {
    height: 35,
    width: 35,
    marginRight: "auto",
  },
});
