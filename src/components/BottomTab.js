import { Audio } from "expo-av";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { getBottomSpace } from "react-native-iphone-x-helper";
import Animated, {
  block,
  Clock,
  clockRunning,
  cond,
  Extrapolate,
  interpolateNode,
  not,
  set,
  useCode,
  Value,
} from "react-native-reanimated";
import {
  clamp,
  onGestureEvent,
  timing,
  withSpring,
} from "react-native-redash/lib/module/v1";
import { album } from "../data/songs";
import MiniPlayer from "./MiniPlayer";
import Player from "./Player";
import TabIcon from "./TabIcon";

const { height } = Dimensions.get("window");
const TABBAR_HEIGHT = getBottomSpace() + 50;
const MINIMIZED_PLAYER_HEIGHT = 42;
const SNAP_TOP = 0;
const SNAP_BOTTOM = height - TABBAR_HEIGHT - MINIMIZED_PLAYER_HEIGHT;
const config = {
  damping: 15,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
};

const styles = StyleSheet.create({
  playerSheet: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "cyan",
  },
  container: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: TABBAR_HEIGHT,
    flexDirection: "row",
  },
});

const translationY = new Value(0);
const velocityY = new Value(0);
const state = new Value(State.UNDETERMINED);
const offset = new Value(SNAP_BOTTOM);
const gestureHandler = onGestureEvent({
  translationY,
  velocityY,
  state,
});
const translateY = clamp(
  withSpring({
    state,
    offset,
    value: translationY,
    velocity: velocityY,
    snapPoints: [SNAP_TOP, SNAP_BOTTOM],
    config,
  }),
  SNAP_TOP,
  SNAP_BOTTOM
);
const opacity = interpolateNode(translateY, {
  inputRange: [SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT, SNAP_BOTTOM],
  outputRange: [0, 1],
  extrapolate: Extrapolate.CLAMP,
});
const overlayOpacity = interpolateNode(translateY, {
  inputRange: [
    SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT * 2,
    SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT,
  ],
  outputRange: [0, 1],
});
const goUp = new Value(0);
const goDown = new Value(0);
const clock = new Clock();
const translateBottomTab = interpolateNode(translateY, {
  inputRange: [SNAP_BOTTOM - TABBAR_HEIGHT, SNAP_BOTTOM],
  outputRange: [TABBAR_HEIGHT, 0],
  extrapolate: Extrapolate.CLAMP,
});

export default ({
  selectedTrackIndex,
  onPlaybackChange,
  isShuffle,
  isAudioPlaying,
  onPressShuffle,
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPositionMillis, setCurrentPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [sound, setSound] = useState();

  useCode(() => {
    return block([
      cond(goUp, [
        set(
          offset,
          timing({ clock, duration: 200, from: SNAP_BOTTOM, to: SNAP_TOP })
        ),
        cond(not(clockRunning(clock)), set(goUp, 0)),
      ]),
      cond(goDown, [
        set(
          offset,
          timing({ clock, duration: 200, from: SNAP_TOP, to: SNAP_BOTTOM })
        ),
        cond(not(clockRunning(clock)), set(goDown, 0)),
      ]),
    ]);
  }, []);

  const handleSongChange = song => {
    setCurrentSongIndex(song);
  };

  const handleMiniPlayerOnPress = () => {
    goUp.setValue(1);
  };

  const handleMiniPlayerOnPressPlaybackButton = playing => {
    setIsPlaying(playing);
  };

  const handlePlaybackAction = actionType => {
    const actions = {
      stepbackward: async () => {
        resetPlaybackInfo();
        if (isShuffle) {
          setCurrentSongIndex(
            Math.floor(Math.random() * (album.tracks.length - 1))
          );
        } else {
          if (currentSongIndex === 0) {
            await sound.setPositionAsync(0);
          }

          setCurrentSongIndex(prev => Math.max(0, prev - 1));
        }

        if (sound && isPlaying) {
          await sound.playAsync();
        }
      },
      stepforward: async () => {
        resetPlaybackInfo();
        if (isShuffle) {
          setCurrentSongIndex(
            Math.floor(Math.random() * (album.tracks.length - 1))
          );
        } else {
          if (currentSongIndex === album.tracks.length - 1) {
            await stopAlbum();
          }
          setCurrentSongIndex(prev =>
            Math.min(album.tracks.length - 1, prev + 1)
          );
        }

        if (sound && isPlaying) {
          await sound.playAsync();
        }
      },
      play: async () => {
        if (sound) {
          await sound.playAsync();
          setIsPlaying(prev => !prev);
        }
      },
      pause: async () => {
        if (sound) {
          await sound.pauseAsync();
          setIsPlaying(prev => !prev);
        }
      },
      "forward-30": async () => {
        if (sound) {
          await sound.setPositionAsync(
            Math.min(durationMillis, currentPositionMillis + 30 * 1000)
          );
        }
      },
      "replay-30": async () => {
        if (sound) {
          await sound.setPositionAsync(
            Math.min(0, currentPositionMillis - 30 * 1000)
          );
        }
      },
      shuffle: async () => {
        onPressShuffle();
      },
    };

    return actions[actionType];
  };

  const handlePlaybackUpdate = async status => {
    const { positionMillis, didJustFinish, isPlaying: isAudioPlaying } = status;

    if (didJustFinish) {
      if (isShuffle) {
        setCurrentSongIndex(
          Math.floor(Math.random() * (album.tracks.length - 1))
        );
      } else if (currentSongIndex < album.tracks.length - 1) {
        setCurrentSongIndex(prev => prev + 1);
      } else {
        await stopAlbum();
      }
    }

    if (isAudioPlaying) {
      setCurrentPositionMillis(positionMillis);
    }
  };

  const handleOnChangeSlider = async ([value]) => {
    setCurrentPositionMillis(value);
  };

  const handleOnSlidingComplete = async ([value]) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const resetPlaybackInfo = () => {
    setCurrentPositionMillis(0);
  };

  const stopAlbum = async () => {
    resetPlaybackInfo();
    setIsPlaying(false);
    setCurrentSongIndex(0);
    if (sound) {
      await sound.setPositionAsync(0);
      await sound.pauseAsync();
    }
  };

  useEffect(() => {
    (async () => {
      if (sound) {
        await sound.unloadAsync();
        setCurrentPositionMillis(0);
        setDurationMillis(0);
      }

      const { tracks } = album;
      const {
        sound: playbackObj,
        status: { durationMillis },
      } = await Audio.Sound.createAsync(tracks[currentSongIndex].uri, {
        shouldPlay: isPlaying,
      });
      playbackObj.setOnPlaybackStatusUpdate(handlePlaybackUpdate);
      setDurationMillis(durationMillis);
      setSound(playbackObj);
    })();
  }, [currentSongIndex]);

  useEffect(() => {
    if (selectedTrackIndex !== undefined) {
      setCurrentSongIndex(selectedTrackIndex);
      setIsPlaying(true);
    }
  }, [selectedTrackIndex]);

  useEffect(() => {
    onPlaybackChange(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    (async () => {
      if (sound) {
        if (isAudioPlaying) {
          await sound.playAsync();
          setIsPlaying(true);
        } else {
          await sound.pauseAsync();
          setIsPlaying(false);
        }
      }
    })();
  }, [isAudioPlaying]);

  return (
    <>
      <PanGestureHandler
        {...gestureHandler}
        activeOffsetX={[-600, 600]}
        activeOffsetY={[-10, 10]}
      >
        <Animated.View
          style={[styles.playerSheet, { transform: [{ translateY }] }]}
        >
          <Player
            isPlaying={isPlaying}
            albumData={album}
            isShuffle={isShuffle}
            track={album.tracks[currentSongIndex]}
            onPress={() => {
              goDown.setValue(1);
              setStatusBarStyle("dark");
            }}
            sound={sound}
            currentPositionMillis={currentPositionMillis}
            currentSongIndex={currentSongIndex}
            durationMillis={durationMillis}
            handleSongChange={handleSongChange}
            handlePlaybackUpdate={handlePlaybackUpdate}
            handleOnChangeSlider={handleOnChangeSlider}
            handleOnSlidingComplete={handleOnSlidingComplete}
            onPressPlayback={handlePlaybackAction}
          />
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              opacity: overlayOpacity,
              backgroundColor: "white",
            }}
            pointerEvents="none"
          />
          <Animated.View
            style={{
              opacity,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: MINIMIZED_PLAYER_HEIGHT,
            }}
          >
            <MiniPlayer
              isShuffle={isShuffle}
              isPlaying={isPlaying}
              onPressPlaybackButton={handleMiniPlayerOnPressPlaybackButton}
              onPress={handleMiniPlayerOnPress}
              currentSong={album.tracks[currentSongIndex]}
              currentArtist={album.artist}
            />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View
        style={{ transform: [{ translateY: translateBottomTab }] }}
      >
        <SafeAreaView style={styles.container}>
          <TabIcon name="home" label="Home" />
          <TabIcon name="search" label="Search" />
          <TabIcon
            name="chevron-up"
            label="Player"
            onPress={() => {
              goUp.setValue(1);
              setStatusBarStyle("light");
            }}
          />
        </SafeAreaView>
      </Animated.View>
    </>
  );
};
