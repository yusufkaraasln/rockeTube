import {useSelector, useDispatch} from 'react-redux';
import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../redux/authSlice';
import Companies from '../components/Companies';
import Actors from '../components/Actors';
import SingleFilm from '../components/SingleFilm';

const Home = () => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    fetch('http://192.168.205.96:5000/api/video/get/')
      .then(response => response.json())
      .then(data => setData(data.videos));
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#242526',
      }}>
      <ScrollView style={styles.container}>
        <Text
          style={{
            fontSize: 18,
            color: '#ffa31a',
            marginTop: 20,
            marginBottom: 10,
          }}>
          Most popular companies
        </Text>
        <Companies />
        <Text
          style={{
            fontSize: 18,
            color: '#ffa31a',
            marginTop: 20,
            marginBottom: 10,
          }}>
          Most popular actors
        </Text>

        <Actors />
        <Text
          style={{
            fontSize: 18,
            color: '#ffa31a',
            marginTop: 20,
            marginBottom: 10,
          }}>
          Latest movies
        </Text>
        {data.map(item => (
          <SingleFilm data={item}
            actorsActive={true}
          key={item._id} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    padding: 20,
    display: 'flex',
    marginBottom: 90,
    gap: 30,
    backgroundColor: '#242526',
  },
});
