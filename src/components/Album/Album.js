import * as React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { album } from "../../data/songs";
import Content from "./Content";
import Cover from "./Cover";

const { Value } = Animated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default ({ onPress, isPlaying, onPressShuffle }) => {
  const y = new Value(0);
  return (
    <View style={styles.container}>
      <Cover {...{ y, album }} />
      <Content
        {...{ y, album }}
        onPress={onPress}
        isPlaying={isPlaying}
        onPressShuffle={onPressShuffle}
      />
    </View>
  );
};
