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
      <Text style={styles.label}>{service.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
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
  label: {
    color: "#E2E8F0",
    fontSize: 20,
    paddingHorizontal: 10,
  },
});

export default ServiceCard;
