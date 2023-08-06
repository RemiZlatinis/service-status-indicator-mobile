import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ServicesScreen, SettingsScreen } from "./screens";
import { registerBackgroundRefreshTaskAsync } from "./tasks/backgroundRefreshTask";
import { useServices } from "./hooks";

const logoOk = require("./assets/status/server-ok.png");
const logoError = require("./assets/status/server-error.png");

export default function App() {
  const [settingsMode, setSettingsMode] = useState(false);
  const { serverDisconnected } = useServices();

  useEffect(() => {
    registerBackgroundRefreshTaskAsync();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        <StatusBar />
        <Image
          style={styles.statusLogo}
          source={serverDisconnected ? logoError : logoOk}
          resizeMode="contain"
        />
        <Ionicons
          name={settingsMode ? "close-circle" : "settings"}
          size={30}
          color="#CBD5E0"
          onPress={() => setSettingsMode(!settingsMode)}
        />
      </View>
      {settingsMode ? <SettingsScreen /> : <ServicesScreen />}
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
