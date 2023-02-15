import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Image} from 'react-native-svg';

const Companies = () => {
  const [companies, setCompanies] = React.useState([]);
  const {width, height} = Dimensions.get('window');

  React.useEffect(() => {
    fetch('http://192.168.205.96:5000/api/company/get')
      .then(response => response.json())
      .then(data => setCompanies(data.companies));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={true}>
        {companies.map((company, index) => {
          return (
            <View
              key={index}
              style={{
                borderRadius: 30,
                flex: 1,
                width: width - 40,
              }}>
              <Image
                style={{
                  width: width - 40,
                  height: 200,
                  resizeMode: 'contain',
                }}
                source={{
                  uri: company.logo,
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 10,
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  color: '#fff',
                }}>
                1
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 30,
    backgroundColor: '#383838',
  },
});

export default Companies;
