import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../redux/authSlice';
import axios from 'axios';
import SingleFilm from '../components/SingleFilm';
const User = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userInfo');
    dispatch(logout());
  };
  const [favs, setFavs] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const res = await axios.get('http://192.168.205.96:5000/api/video/get/');
      setFavs(res.data.videos);
    })();
  }, []);

  const createdAt = new Date(user.createdAt).toLocaleDateString();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={styles.userInfo}>
          <View
            style={{
              flex: 3,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 30,
            }}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
              source={{
                uri: user.profilePic
                  ? user.profilePic
                  : 'https://www.munzur.edu.tr/birimler/akademik/armer/kadin/Images/yonetim/indir.png',
              }}
            />
          </View>
          <View
            style={{
              flex: 5,
              justifyContent: 'center',
              gap: 5,
            }}>
            <Text style={styles.userInfo.text}>{user.name}</Text>
            <Text style={styles.userInfo.text.other}>{user.email}</Text>
            <Text style={styles.userInfo.text.other}>
              Favorites{' '}
              <Text
                style={{
                  color: '#ffa31a',
                }}>
                {user.favorites.length}
              </Text>
            </Text>
            <Text style={styles.userInfo.text.other}>{createdAt}</Text>
          </View>
        </View>
        
        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={handleLogout}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#ffa31a',
                marginVertical: 20,
                paddingVertical: 15,
                paddingHorizontal: 30,
                borderRadius: 16,
                backgroundColor: '#383838',
              }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#ffa31a',
            marginHorizontal: 30,
          }}>
          Favorites
        </Text>
        <View style={styles.favorites}>
          {favs.map(video => (
            <SingleFilm data={video} key={video._id} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#242526',
  },
  userInfo: {
    marginTop: 20,
    marginHorizontal: 15,
    flex: 1,
    gap: 50,
    flexDirection: 'row',
    borderRadius: 50,
    text: {
      color: '#ffa31a',
      fontSize: 20,
      fontWeight: 'bold',
      other: {
        color: '#ccc',
      },
      settings: {
        color: '#ccc',
        fontSize: 16,
      },
    },
  },
  favorites: {
    flex: 4,
  },
});
export default User;
