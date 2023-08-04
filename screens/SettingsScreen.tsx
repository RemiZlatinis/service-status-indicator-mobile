import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

import { SafeScreen } from "../components/common";
import { get, save } from "../utils/settingsStorage";

function SettingsScreen() {
  const [url, setUrl] = useState<string>();
  const [token, setToken] = useState<string>();

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
  };

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
      <Text style={styles.label}>TOKEN</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={token}
        onChangeText={setToken}
      />
      <View style={styles.buttonContainer}>
        <Button title="save" onPress={handleSave} />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: { margin: 20 },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: "lightgrey",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 30,
  },
  buttonContainer: {
    overflow: "hidden",
    borderRadius: 30,
  },
});

export default SettingsScreen;
