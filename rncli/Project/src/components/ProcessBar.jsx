import React from 'react';
import Slider from '@react-native-community/slider';
import {View, Text, StyleSheet} from 'react-native';

const ProgressBar = props => {
  const {
    currentTime,
    duration,
    onSlideCapture,
    onSlideStart,
    onSlideComplete,
    fullscreen,
  } = props;

  const getMinutesFromSeconds = time => {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${
      seconds >= 10 ? seconds : '0' + seconds
    }`;
  };

  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);

  const handleOnSlide = time => {
    onSlideCapture({seekTime: time});
  };

  return (
    <View style={styles.wrapper}>
      <Slider
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingStart={onSlideStart}
        onSlidingComplete={onSlideComplete}
        minimumTrackTintColor={'#ffa31a'}
        maximumTrackTintColor={'#FFFFFF'}
        thumbTintColor={'#ffa31a'}
      />
      <View style={styles.timeWrapper}>
        <Text style={
            fullscreen ? styles.fullScreenTime.left : styles.timeLeft
        }>{position}</Text>
        <Text style={
            fullscreen ? styles.fullScreenTime.right : styles.timeRight
        }>{fullDuration}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  timeLeft: {
    flex: 1,
    fontSize: 12,
    color: '#8f8f8f',
    paddingLeft: 20,
  },
  timeRight: {
    flex: 1,
    fontSize: 12,
    color: '#8f8f8f',
    textAlign: 'right',
    paddingRight: 20,
  },

  fullScreenTime: {
    right: {
      flex: 1,
      fontSize: 13,
      color: '#ccc',
      textAlign: 'right',
      padding: 15,

    },
    left: {
      flex: 1,
      fontSize: 13,
      color: '#ccc',
        padding: 15,
    },
  },
});

export default ProgressBar;
