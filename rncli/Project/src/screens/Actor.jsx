import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React from 'react';
import SingleFilm from '../components/SingleFilm';

const Actor = ({route}) => {
  const {actor} = route.params;

  console.log(actor.films);
  console.log(actor.films);
  console.log(actor.films);
  console.log(actor.films);
  console.log(actor.films);

  return (
    <View style={styles.container}>
      <View style={styles.bio}>
        <View
          style={{
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              height: 70,
              width: 70,
              borderRadius: 100,
            }}
            source={{
              uri: actor.photo,
            }}
          />
        </View>
        <View
          style={{
            flex: 3,
            alignItems: 'center',
            gap: 64,
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <View>
            <Text
              style={{
                color: '#777777',
                fontSize: 12,
                fontWeight: 'bold',
                marginBottom: 5,
              }}>
              Name
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#ffa31a',
              }}>
              {actor.name}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: '#777777',
                fontWeight: 'bold',
                fontSize: 12,
                marginBottom: 5,
              }}>
              Age
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#ffa31a',
              }}>
              {actor.age}
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          margin: 20,
          marginTop: 30,
          fontSize: 16,
          color: '#cccccca7',
        }}>
        Videos from {actor.name}
      </Text>
      <View style={styles.movies}>
        <ScrollView>
          {actor.films.map(film => (
            <SingleFilm key={film._id} data={film} actorsActive={false} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242526',
  },

  bio: {
    flex: 1,
    flexDirection: 'row',
  },
  movies: {
    flex: 8,
  },
});

export default Actor;
