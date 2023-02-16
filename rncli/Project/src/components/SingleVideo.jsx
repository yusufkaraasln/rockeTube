import React, {useState, useEffect} from 'react';
import Video from 'react-native-video';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import ProgressBar from './ProcessBar';
import PlayerControls from './PlayerControls';
import {faExpand, faCompress} from '@fortawesome/free-solid-svg-icons';
import Orientation from 'react-native-orientation-locker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const windowHeight = Dimensions.get('window').width * 0.5625;
const windowWidth = Dimensions.get('window').width;

const height = Dimensions.get('window').width - 10;
const width = Dimensions.get('window').height + 10;

const SingleVideo = ({route}) => {
  const videoRef = React.createRef();
  const {data} = route.params;

  console.log(data);

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [play, setPlay] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControl, setShowControl] = useState(true);
  const [loading, setLoading] = useState(true);
  const handleOrientation = orientation => {
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
      setFullscreen(true);
      StatusBar.setHidden(true);
    } else {
      setFullscreen(false);
      StatusBar.setHidden(false);
    }
  };

  const handlePlayPause = () => {
    if (play) {
      setPlay(false);
      setShowControl(true);
      return;
    }
    setTimeout(() => setShowControl(false), 2000);
    setPlay(true);
  };

  const handlePlay = () => {
    setTimeout(() => setShowControl(false), 500);
    setPlay(true);
  };

  const skipBackward = () => {
    videoRef.current.seek(currentTime - 15);
    setCurrentTime(currentTime - 15);
  };

  const skipForward = () => {
    videoRef.current.seek(currentTime + 15);
    setCurrentTime(currentTime + 15);
  };

  const handleControls = () => {
    if (showControl) {
      setShowControl(false);
    } else {
      setShowControl(true);
    }
  };

  const handleFullscreen = () => {
    if (fullscreen) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToLandscapeLeft();
    }
  };

  const onLoadEnd = data => {
    setDuration(data.duration);
    setCurrentTime(data.currentTime);
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const onSeek = data => {
    videoRef.current.seek(data.seekTime);
    setCurrentTime(data.seekTime);
  };

  const onEnd = () => {
    setPlay(false);
    videoRef.current.seek(0);
  };

  return (
   
      <View style={fullscreen ? styles.fullscreenContainer : styles.container}>
        <TouchableOpacity activeOpacity={1} onPress={handleControls}>
          <>
            <Video
              poster={data.cover_url}
              ref={videoRef}
              source={{
                uri: data.video_url,
              }}
              style={fullscreen ? styles.fullscreenVideo : styles.video}
              controls={false}
              onLoad={onLoadEnd}
              onProgress={onProgress}
              onEnd={onEnd}
              onReadyForDisplay={() => setLoading(false)}
              paused={!play}
            />

            {showControl && (
              <View style={styles.controlOverlay}>
                <TouchableOpacity
                  onPress={handleFullscreen}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  style={styles.fullscreenButton}>
                  {fullscreen ? (
                    <FontAwesomeIcon icon={faCompress} size={20} color="#fff" />
                  ) : (
                    <FontAwesomeIcon icon={faExpand} size={20} color="#fff" />
                  )}
                </TouchableOpacity>

                <PlayerControls
                  onPlay={handlePlay}
                  onPause={handlePlayPause}
                  playing={play}
                  skipBackwards={skipBackward}
                  skipForwards={skipForward}
                  loading={loading}
                />

                <ProgressBar
                  currentTime={currentTime}
                  duration={duration > 0 ? duration : 0}
                  onSlideStart={handlePlayPause}
                  onSlideComplete={handlePlayPause}
                  onSlideCapture={onSeek}
                  fullscreen={fullscreen}
                />
              </View>
            )}
          </>
        </TouchableOpacity>
        <Text
          style={{
            color: '#fff',
            fontSize: 22,
            fontWeight: '400',
            marginHorizontal: 20,
            marginTop: 10,
          }}
          numberOfLines={2}
          ellipsizeMode="tail">
          {data.title}
        </Text>

        <View style={styles.details}>
          <TouchableOpacity>
            <Text
              style={{
                color: '#ccc',
                fontSize: 13,
                fontWeight: '400',
                borderWidth: 1,
                marginVertical: 10,
                borderColor: '#cccccc21',
                padding: 10,
                borderRadius: 16,
              }}
              numberOfLines={2}
              ellipsizeMode="tail">
              {data.description}
            </Text>
          </TouchableOpacity>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                height: 40,
              }}>
              {data?.actors.map(actor => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    backgroundColor: '#ffa31a',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 20,

                    borderRadius: 16,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 13,
                      fontWeight: '400',
                    }}>
                    {actor.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={styles.comments}>
          <ScrollView>
            <Text
              style={{
                color: '#ccc',
                fontSize: 14,
                fontWeight: '400',
                marginTop: 10,
              }}>
              Recommended Videos
            </Text>
          </ScrollView>
        </View>
      </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#242526',
    flex: 1,
  },
  details: {
    flex: 1,
    backgroundColor: '#242526',
    marginHorizontal: 20,
    marginTop: 5,
  },

  comments: {
    flex: 3,
    backgroundColor: '#242526',
    marginHorizontal: 20,
    marginTop: 5,
  },

  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#242526',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  loader: {
    position: 'absolute',
    top: height / 2,
    left: width / 2,
  },
  video: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: '#242526',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  fullscreenVideo: {
    flex: 1,
    height: height,
    width: width + 20,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
});

export default SingleVideo;
