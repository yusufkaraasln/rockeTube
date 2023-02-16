import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

import {useNavigation} from '@react-navigation/native';

const Actors = ( ) => {
  const [actors, setActors] = React.useState([]);
  const {navigate} = useNavigation();


  React.useEffect(() => {
    fetch('http://192.168.205.96:5000/api/actor/get')
      .then(response => response.json())
      .then(data => setActors(data.actors));
  }, []);

  return (
    <View style={styles.container}>
      <>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {actors.map((actor, index) => (
            <TouchableOpacity
              onPress={() => navigate('Actor', {actor})}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 15,

                  borderRadius: 16,
                }}>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    borderWidth: actor.photo ? 2 : 0,
                    borderColor: '#ffa31a',
                    resizeMode: 'contain',
                  }}
                  source={{
                    uri: actor.photo
                      ? actor.photo
                      : 'https://www.munzur.edu.tr/birimler/akademik/armer/kadin/Images/yonetim/indir.png',
                  }}
                />

                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#cccccc89',
                  }}>
                  {actor.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    height: 120,
    borderColor: '#3838382f',
    borderWidth: 3,
  },
});
export default Actors;
