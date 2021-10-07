import React from "react";
import { StyleSheet, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#0023b5",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});

export default ({ name, onPress, label }) => {
  return (
    <RectButton {...{ onPress }} style={styles.container}>
      <Icon {...{ name }} size={24} color="#0023b5" />
      <Text style={styles.label}>{label}</Text>
    </RectButton>
  );
};
