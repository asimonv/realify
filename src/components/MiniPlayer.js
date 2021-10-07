import { Feather as Icon } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import TextTicker from "react-native-text-ticker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "lightgray",
  },
  text: {
    color: "black",
    alignSelf: "center",
  },
  circleButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ({
  currentSong,
  currentArtist,
  onPress,
  onPressPlaybackButton,
  isPlaying,
  isShuffle,
}) => {
  const { name } = currentSong;
  const textTickerRef = useRef();

  useEffect(() => {
    textTickerRef.current.startAnimation();
  }, []);

  const handleOnPressPlaybackButton = () => {
    onPressPlaybackButton(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={{
            flexShrink: 1,
            marginHorizontal: 10,
          }}
        >
          <TextTicker
            onPress={onPress}
            ref={textTickerRef}
            style={styles.text}
            duration={10000}
            loop
            repeatSpacer={10}
            marqueeDelay={1000}
          >
            {`${name} · ${currentArtist}`}
          </TextTicker>
        </View>

        <RectButton onPress={handleOnPressPlaybackButton}>
          <Icon
            name={isPlaying ? "pause-circle" : "play-circle"}
            color="black"
            size={24}
          />
        </RectButton>
      </View>
    </View>
  );
};
