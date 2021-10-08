import * as React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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
    <Image
      style={styles.image}
      source={track.album.cover}
      resizeMode="contain"
    />
  </RectButton>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
  },
  cell: {
    padding: 16,
    justifyContent: "center",
  },
  index: {
    color: "#b2b3b4",
    fontFamily: "AcuminProLight",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius: 5,
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
