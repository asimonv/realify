import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { LogBox } from "react-native";
import Album from "./components/Album";
import BottomTab from "./components/BottomTab";
import LoadAssets from "./components/LoadAssets";

const assets = [require("../assets/kinggizz.jpeg")];

const fonts = [
  { LeituraNews: require("../assets/fonts/LeituraNews-Roman4.otf") },
  { AcuminProLight: require("../assets/fonts/AcuminProLight.otf") },
  { AcuminProSemibold: require("../assets/fonts/AcuminProSemibold.otf") },
];

LogBox.ignoreLogs([
  "useCode() first argument should be a function that returns an animation node.",
]);

export default function App() {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playThroughEarpieceAndroid: false,
      });
    })();
  }, []);

  const handleContentOnPress = (_, index) => {
    setSelectedTrackIndex(index);
  };

  const handleOnPlaybackChange = status => {
    setIsAudioPlaying(status);
  };

  const handleOnPressShuffle = (updatePlayingState = true) => {
    if (updatePlayingState) {
      if (!isAudioPlaying) {
        setIsShuffle(true);
      }
      setIsAudioPlaying(prev => !prev);
    } else {
      setIsShuffle(prev => !prev);
    }
  };
  return (
    <LoadAssets {...{ assets, fonts }}>
      <StatusBar />
      <Album
        onPress={handleContentOnPress}
        isPlaying={isAudioPlaying}
        onPressShuffle={handleOnPressShuffle}
      />
      <BottomTab
        isAudioPlaying={isAudioPlaying}
        isShuffle={isShuffle}
        selectedTrackIndex={selectedTrackIndex}
        onPlaybackChange={handleOnPlaybackChange}
        onPressShuffle={() => handleOnPressShuffle(false)}
      />
    </LoadAssets>
  );
}
