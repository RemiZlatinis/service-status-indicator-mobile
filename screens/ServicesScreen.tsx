import { ActivityIndicator, StyleSheet } from "react-native";

import { SafeScreen } from "../components/common";
import ServicesList from "../components/services/ServicesList";
import { Service } from "../models";

interface Props {
  services: Service[];
  loading: boolean;
}

function ServicesScreen({ services, loading }: Props) {
  return (
    <SafeScreen style={styles.screen}>
      {loading && services.length === 0 ? (
        <ActivityIndicator
          size="large"
          color="#4A5568"
          style={styles.indicator}
        />
      ) : (
        <ServicesList services={services} />
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1A202C",
  },
  indicator: { flex: 1 },
});

export default ServicesScreen;
