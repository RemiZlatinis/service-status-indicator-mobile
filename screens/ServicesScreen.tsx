import { StyleSheet } from "react-native";
import { SafeScreen } from "../components/common";
import ServicesList from "../components/services/ServicesList";
import { useServices } from "../hooks";

function ServicesScreen() {
  const { services } = useServices();

  return (
    <SafeScreen style={styles.screen}>
      <ServicesList services={services} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1A202C",
  },
});

export default ServicesScreen;
