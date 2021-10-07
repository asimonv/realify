import { AntDesign, Feather as Icon, MaterialIcons } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BaseButton, RectButton } from "react-native-gesture-handler";
import TextTicker from "react-native-text-ticker";
import { parseMillis } from "../utils/time";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    margin: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 16,
  },
  title: {
    color: "white",
    padding: 16,
    fontFamily: "AcuminProSemibold",
  },
  cover: {
    marginVertical: 16,
    width: width - 32,
    height: width - 32,
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  song: {
    fontSize: 32,
    color: "white",
    fontFamily: "LeituraNews",
  },
  artist: {
    color: "white",
    fontFamily: "AcuminProSemibold",
  },
  slider: {
    width: width - 32,
    borderRadius: 2,
    height: 4,
    marginTop: 16,
    marginBottom: 10,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  playbackStatus: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  playbackText: {
    fontFamily: "AcuminProSemibold",
    color: "rgba(255,255,255,0.5)",
  },
  shuffleCircle: {
    backgroundColor: "#55b661",
    width: 4,
    height: 4,
    borderRadius: 2,
    position: "absolute",
    bottom: -5,
  },
  centeredRows: {
    alignItems: "center",
  },
});

export default ({
  onPress,
  albumData,
  handleOnChangeSlider,
  handleOnSlidingComplete,
  isPlaying,
  onPressPlayback = () => {},
  currentPositionMillis,
  durationMillis,
  sound,
  track,
  isShuffle,
}) => {
  const { artist } = albumData;

  useEffect(() => {
    (async () => {
      if (sound) {
        if (isPlaying) {
          await sound.playAsync();
        } else {
          await sound.pauseAsync();
        }
      }
    })();
  }, [isPlaying]);

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={track.album.colors}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <RectButton style={styles.button} {...{ onPress }}>
            <View accessible accessibilityRole="button">
              <Icon name="chevron-down" color="white" size={24} />
            </View>
          </RectButton>
          <Text style={styles.title}>{track.album.name}</Text>
          <RectButton style={styles.button} {...{ onPress }}>
            <View accessible accessibilityRole="button">
              <Icon name="more-horizontal" color="white" size={24} />
            </View>
          </RectButton>
        </View>
        <Image source={track.album.cover} style={styles.cover} />
        <View style={styles.metadata}>
          <View
            style={{
              flexShrink: 1,
              marginRight: 10,
            }}
          >
            <TextTicker
              style={styles.song}
              duration={10000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
            >
              {track.name}
            </TextTicker>
            <Text style={styles.artist}>{artist}</Text>
          </View>
          <RectButton
            style={styles.centeredRows}
            onPress={() => onPressPlayback("shuffle")()}
          >
            <MaterialIcons
              name="shuffle"
              size={24}
              color={isShuffle ? "#55b661" : "rgba(255,255,255, 0.8)"}
            />
            {isShuffle && <View style={styles.shuffleCircle} />}
          </RectButton>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationMillis}
          minimumTrackTintColor="white"
          maximumTrackTintColor="rgba(163, 163, 163, 0.5)"
          onValueChange={handleOnChangeSlider}
          onSlidingComplete={handleOnSlidingComplete}
          thumbTintColor="white"
          value={currentPositionMillis}
        />
        <View style={styles.playbackStatus}>
          <Text style={styles.playbackText}>
            {parseMillis(currentPositionMillis, false)}
          </Text>
          <Text style={styles.playbackText}>
            {`-${parseMillis(durationMillis - currentPositionMillis, false)}`}
          </Text>
        </View>
        <View style={styles.controls}>
          <BaseButton onPress={() => onPressPlayback("replay-30")()}>
            <MaterialIcons name="replay-30" size={32} color="white" />
          </BaseButton>
          <BaseButton onPress={() => onPressPlayback("stepbackward")()}>
            <AntDesign name="stepbackward" color="white" size={32} />
          </BaseButton>
          <BaseButton
            onPress={() => onPressPlayback(isPlaying ? "pause" : "play")()}
          >
            <AntDesign
              name={isPlaying ? "pausecircle" : "play"}
              color="white"
              size={48}
            />
          </BaseButton>
          <BaseButton onPress={() => onPressPlayback("stepforward")()}>
            <AntDesign name="stepforward" color="white" size={32} />
          </BaseButton>
          <BaseButton onPress={() => onPressPlayback("forward-30")()}>
            <MaterialIcons name="forward-30" size={32} color="white" />
          </BaseButton>
        </View>
      </View>
    </SafeAreaView>
  );
};
