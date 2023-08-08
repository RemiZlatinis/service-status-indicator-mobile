import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  BarCodeScanner,
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-barcode-scanner";

import { SafeScreen } from "../components/common";
import { get, save } from "../utils/settingsStorage";
import { updateAPISettings } from "../api";

function SettingsScreen() {
  const [url, setUrl] = useState<string>();
  const [token, setToken] = useState<string>();
  const [scanned, setScanned] = useState(true);

  const requestPermissions = async () => {
    const { granted } = await getPermissionsAsync();
    if (!granted) await requestPermissionsAsync();
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    const readSettings = async () => {
      setUrl((await get("url")) || undefined);
      setToken((await get("token")) || undefined);
    };

    readSettings();
  }, []);

  const handleSave = () => {
    save("url", url || "");
    save("token", token || "");
    updateAPISettings({ token, url });
  };

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    setToken(data);
  };

  if (!scanned)
    return (
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    );

  return (
    <SafeScreen style={styles.screen}>
      <Text style={styles.label}>API URL</Text>
      <TextInput
        textContentType="URL"
        keyboardType="url"
        style={styles.input}
        value={url}
        onChangeText={setUrl}
      />
      <View style={styles.tokenContainer}>
        <Text style={styles.label}>TOKEN</Text>
        <View style={[styles.buttonContainer, styles.scanButton]}>
          <Button
            title={"Tap to Scan QR Token"}
            onPress={() => setScanned(false)}
            color="#718096"
          />
        </View>
      </View>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={token}
        onChangeText={setToken}
      />
      <View style={styles.buttonContainer}>
        <Button title="save" onPress={handleSave} color="#718096" />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: "#1A202C" },
  label: {
    color: "#E2E8F0",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 20,
    marginTop: 10,
    fontSize: 18,
    backgroundColor: "#CBD5E0",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 30,
  },
  buttonContainer: {
    overflow: "hidden",
    borderRadius: 30,
  },
  scanButton: {
    marginLeft: "auto",
  },
  tokenContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});

export default SettingsScreen;
