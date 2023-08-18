import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BarCodeScanner,
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-barcode-scanner";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setUrl(data.substring(data.indexOf("{'") + 2, data.indexOf("',")));
    setToken(data.substring(data.indexOf(" '") + 2, data.indexOf("'}")));
    setScanned(true);
  };

  return (
    <SafeScreen style={styles.screen}>
      {!scanned && (
        <View style={styles.scanScreen}>
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              style={styles.scanner}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
          </View>
        </View>
      )}

      {/* QR Button */}
      <View style={styles.qrContainer}>
        <Text style={styles.label}>{scanned ? "Scan" : "Cancel"}</Text>
        <TouchableOpacity
          style={styles.qrButtonContainer}
          onPress={() => setScanned(!scanned)}
        >
          <MaterialCommunityIcons
            name={scanned ? "qrcode-scan" : "window-close"}
            size={35}
            color="#E2E8F0"
          />
        </TouchableOpacity>
      </View>

      {/* Settings Form */}
      <Text style={styles.label}>API URL</Text>
      <TextInput
        textContentType="URL"
        keyboardType="url"
        style={styles.input}
        value={url}
        onChangeText={setUrl}
      />
      <Text style={styles.label}>TOKEN</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={token}
        onChangeText={setToken}
      />
      <View>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
          <Text style={styles.label}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scanScreen: {
    width: "100%",
    position: "absolute",
    overflow: "hidden",
    zIndex: 1,
    top: 20,
    alignSelf: "center",
    backgroundColor: "#1A202C",
  },
  scanner: {
    transform: [{ scale: 1.8 }], // Zoom at least 16:9
    aspectRatio: 1,
  },
  scannerContainer: {
    overflow: "hidden",
    borderRadius: 30,
  },
  screen: { flex: 1, padding: 20, backgroundColor: "#1A202C" },
  label: {
    color: "#E2E8F0",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 20,
    marginTop: 10,
    fontSize: 20,
    backgroundColor: "#CBD5E0",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 40,
  },
  buttonContainer: {
    fontSize: 20,
    overflow: "hidden",
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#718096",
  },
  scanButton: {
    marginLeft: "auto",
  },
  qrContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  qrButtonContainer: {
    backgroundColor: "#4A5568",
    padding: 15,
    borderRadius: 50,
    marginLeft: 10,
  },
});

export default SettingsScreen;
