import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

import {useNavigation} from '@react-navigation/native';

const SingleFilm = ({data}) => {
  const {width, height} = Dimensions.get('window');
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Video', {
        data
      })}
      activeOpacity={0.6}>
      <View style={styles.container}>
        <View>
          <Image
            source={{
              uri: data.cover_url,
            }}
            style={{
              width: width - 60,
              height: 190,
              position: 'relative',
              borderRadius: 20,
              resizeMode: 'cover',
            }}
          />
          <View
            name="image-dark-filter"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.315)',
              borderRadius: 20,
            }}></View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              color: '#ffa31a',
            }}>
            <Text
              style={{
                fontSize: 16,
                borderBottomRightRadius: 20,
                borderTopLeftRadius: 20,
                padding: 10,
                paddingVertical: 5,
                color: '#000',
                backgroundColor: '#ffa31a',
              }}>
              {data.company?.name}
            </Text>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-start',

            width: width - 60,
            gap: 10,
            margin: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#ffa31a',
              marginVertical: 10,
            }}>
            {data.title}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 10,
              width: width - 60,
            }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {data?.actors.map((actor, index) => (
                <Text
                  style={{
                    fontSize: 14,
                    borderColor: '#383838',
                    borderWidth: 1,
                    borderRadius: 10,
                    textAlign: 'center',
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                    color: '#979797',
                  }}>
                  {actor?.name}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#3838382f',
    borderWidth: 3,

    borderRadius: 30,
    marginBottom: 20,
    padding: 10,
  },
});
export default SingleFilm;
