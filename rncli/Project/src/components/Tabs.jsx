import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Search from '../screens/Search';
import User from '../screens/User';
import {StyleSheet, Text, View} from 'react-native';

import {faHome, faSearch, faUser} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const focused = useSelector(state => state.input.searchBar);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          position: 'absolute',
          display: focused ? 'none' : 'flex',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffa31a',
          borderRadius: 15,
          height: 60,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <FontAwesomeIcon
                icon={faHome}
                size={25}
                color={focused ? '#000' : '#fff'}
              />
            </View>
          ),
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <FontAwesomeIcon
                icon={faSearch}
                size={25}
                color={focused ? '#000' : '#fff'}
              />
            </View>
          ),
        }}
        name="Search"
        component={Search}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <FontAwesomeIcon
                icon={faUser}
                size={25}
                color={focused ? '#000' : '#fff'}
              />
            </View>
          ),
        }}
        name="User"
        component={User}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#ffa31a',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default Tabs;
