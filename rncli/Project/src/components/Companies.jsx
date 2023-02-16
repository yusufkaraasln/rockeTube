import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React from 'react';

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
        
        showsHorizontalScrollIndicator={false}>
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
                  borderRadius: 30,
                }}
                resizeMode="cover"
                source={{
                  uri: company.logo,
                }}
              />
              
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

export default Companies;
