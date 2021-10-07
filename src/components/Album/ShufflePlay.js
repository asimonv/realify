import * as React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

export const BUTTON_HEIGHT = 48;
export const BUTTON_WIDTH = 200;

export default ({ isPlaying, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.button}>
      <Text style={styles.label}>{isPlaying ? "PAUSE" : "SHUFFLE PLAY"}</Text>
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    backgroundColor: "#0023b5",
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    borderRadius: 32,
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontFamily: "AcuminProSemibold",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});
