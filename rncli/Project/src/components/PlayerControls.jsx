import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {
  faForward,
  faBackward,
  faPlay,
  faPause,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const PlayerControls = props => {
  const {playing, onPlay, onPause, skipForwards, skipBackwards, loading} =
    props;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
        <FontAwesomeIcon icon={faBackward} size={25} color="#fff" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={styles.loader} />
      ) : (
        <TouchableOpacity
          style={styles.touchable}
          onPress={playing ? onPause : onPlay}>
          {playing ? (
            <FontAwesomeIcon icon={faPause} size={25} color="#fff" />
          ) : (
            <FontAwesomeIcon icon={faPlay} size={25} color="#fff" />
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
        <FontAwesomeIcon icon={faForward} size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 3,
  },
  touchable: {
    padding: 5,
  },
  touchableDisabled: {
    opacity: 0.3,
  },
});

export default PlayerControls;
