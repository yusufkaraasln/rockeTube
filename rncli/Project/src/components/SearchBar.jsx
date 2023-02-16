import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {searchBar} from '../redux/inputSlice';
import {faSearch, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
const SearchBar = () => {
  const focused = useSelector(state => state.input.searchBar);
  const dispatch = useDispatch();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        dispatch(searchBar(true));
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        dispatch(searchBar(false));
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [text, setText] = React.useState('');

  
  return (
    <View style={styles.bar}>
      <TextInput
        onChangeText={text => setText(text)}
        placeholder="Search..."
        value={text}
        placeholderTextColor={'#cccccc6e'}
        style={{
          color: '#ccc',
        }}
        autoFocus={false}
        keyboardAppearance="dark"
      />
      {text.length > 0 ? (
        <TouchableOpacity
          onPress={() => setText('')}
          style={{
            position: 'absolute',
            right: 15,
            justifyContent: 'center',
            color: '#ffa31a',
          }}>
          <FontAwesomeIcon
            style={{
              position: 'absolute',
              right: 5,
              color: '#ffa31a',
            }}
            size={20}
            icon={faXmark}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 15,
            justifyContent: 'center',
            color: '#ffa31a',
          }}>
          <FontAwesomeIcon
            style={{
              position: 'absolute',
              right: 5,
              color: '#ffa31a',
            }}
            size={20}
            icon={faSearch}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  bar: {
    margin: 20,
    justifyContent: 'center',
    borderRadius: 16,
    padding: 5,
    paddingRight: 50,
    backgroundColor: '#383838',
  },
});
