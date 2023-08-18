import { Image, StyleSheet, Text, View, ViewProps } from "react-native";

import { Service } from "../../models";

const statusImage = {
  ok: require("./images/ok.png"),
  update: require("./images/update.png"),
  warning: require("./images/warning.png"),
  failure: require("./images/failure.png"),
};

interface Props extends ViewProps {
  service: Service;
}

function ServiceCard({ service, ...props }: Props) {
  return (
    <View {...props} style={[styles.container, props.style]}>
      <Image style={styles.image} source={statusImage[service.status]} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{service.label}</Text>
        {service.message && (
          <Text style={styles.message}>{service.message}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: "100%",
    backgroundColor: "#4A5568",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  image: {
    height: 30,
    width: 30,
  },
  textContainer: {
    paddingHorizontal: 10,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 20,
  },
  message: {
    color: "#A0AEC0",
    fontSize: 14,
  },
});

export default ServiceCard;
