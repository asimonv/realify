import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

const Track = ({ track, artist, index, onPress = () => {} }) => (
  <RectButton style={styles.row} onPress={() => onPress(track, index)}>
    <View style={styles.cell}>
      <Text style={styles.index}>{index + 1}</Text>
    </View>
    <View style={[styles.cell, { flex: 1 }]}>
      <Text style={styles.name}>{track.name}</Text>
      <Text style={styles.artist}>{track.artist || artist}</Text>
    </View>
    <View style={styles.cell}>
      <Icon name="more-horizontal" color="#b2b3b4" size={24} />
    </View>
  </RectButton>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: "white",
  },
  cell: {
    padding: 16,
    justifyContent: "center",
  },
  index: {
    color: "#b2b3b4",
    fontFamily: "AcuminProLight",
  },
  artist: {
    color: "#b2b3b4",
    fontFamily: "AcuminProLight",
  },
  name: {
    fontFamily: "AcuminProLight",
    color: "black",
  },
});

export default Track;
