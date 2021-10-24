import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Video, Audio } from 'expo-av';
import { TapGestureHandler } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

const videoURL2 = 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
const { height, width } = Dimensions.get('window');

export default function App() {
  const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);
  const video = useRef<Video>(null);
  const doubleTapRef = useRef();
  const [teste, setTeste] = useState(true);
  const scale = useSharedValue(0);
  const scalePlayAndPause = useSharedValue(0);

  const functionTeste = useCallback(() => {
    setTeste(oldState => !oldState);
    scalePlayAndPause.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        scalePlayAndPause.value = withDelay(300,withTiming(0));
      }
    });
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    })
  }, [])

  const doubleTap = useCallback(async () => {
    await impactAsync(ImpactFeedbackStyle.Heavy)
    scale.value = withSpring(1, undefined, (isFinished) => {
        if (isFinished) {
          scale.value = withDelay(300,withTiming(0));
        }
      });
  }, []);

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      }
    ] 
  }))

  const playAndPauseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scalePlayAndPause.value,
      }
    ] 
  }))


  return (
      <TapGestureHandler 
        waitFor={doubleTapRef} 
        onActivated={functionTeste}
        >
        <TapGestureHandler maxDelayMs={250} ref={doubleTapRef} numberOfTaps={2} onActivated={doubleTap}>
          <Animated.View>
            <Video
              ref={video}
              style={styles.video}
              source={{
                uri: videoURL2
              }}
              resizeMode="cover"
              isLooping
              shouldPlay={teste}
              />
            {
              teste ?
              <AnimatedIcon name="playcircleo" style={[styles.icon, playAndPauseStyle]} />
              :
              <AnimatedIcon name="pausecircle" style={[styles.icon, playAndPauseStyle]} />
            }
            <AnimatedIcon name="heart" style={[styles.icon, rStyle]} />
          </Animated.View>
        </TapGestureHandler>
      </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  video: {
    height,
    width,
  },
  icon: {
    position: 'absolute',
    color: 'white',
    alignSelf: 'center',
    top: '50%',
    fontSize: 100,
  }
});
