import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React from 'react';

const Actors = () => {
  const [actors, setActors] = React.useState([]);

  React.useEffect(() => {
    fetch('http://192.168.205.96:5000/api/actor/get')
      .then(response => response.json())
      .then(data => setActors(data.actors));
  }, []);

  return (
    <View style={styles.container}>
      <>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}
          
        >
          {actors.map((actor, index) => (
            <View
              style={{
                marginHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 15,

                backgroundColor: '#383838',
                borderRadius: 16,
              }}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  resizeMode: 'contain',
                }}
                source={{
                  uri: actor.photo ? actor.photo :  "https://www.munzur.edu.tr/birimler/akademik/armer/kadin/Images/yonetim/indir.png",
                }}
              />

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#fff',
                }}>
                {actor.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    backgroundColor: '#383838',
    height: 120,
    marginVertical: 10,
    padding: 10,
  },
});
export default Actors;
