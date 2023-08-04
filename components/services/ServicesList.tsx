import { StyleSheet, View } from "react-native";

import { Service } from "../../models";
import ServiceCard from "./ServiceCard";

interface Props {
  services: Service[];
}

function ServicesList({ services }: Props) {
  return (
    <View style={styles.container}>
      {services.map((service) => (
        <ServiceCard
          style={styles.cardContainer}
          service={service}
          key={service.label}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  cardContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    width: "auto",
  },
});

export default ServicesList;
