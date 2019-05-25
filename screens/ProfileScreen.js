import React from 'react';
import { Text, View, Alert, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import * as actions from '../actions';


class ProfileScreen extends React.Component {
  onResetButtonPress = async (key) => {
    await AsyncStorage.removeItem(key);

    Alert.alert(
      'Reset',
      `'${key}' in AsyncStorage has been removed.`,
      [
        { text: 'OK' },
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ padding: 20 }}>
          <Button
            title="Go to Setting1Screen"
            onPress={() => this.props.navigation.navigate('setting1')}
          />
        </View>

        <View style={{ padding: 20 }}>
          <Button
            title="Reset welcome page"
            buttonStyle={{ backgroundColor: 'red' }}
            onPress={() => this.onResetButtonPress('isInitialized')}
          />
        </View>

        <View style={{ padding: 20 }}>
          <Button
            title="Reset all review data"
            buttonStyle={{ backgroundColor: 'red' }}
            onPress={() => this.onResetButtonPress('allReviews')}
          />
        </View>
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    allReviews: state.review.allReviews,
  };
};


export default connect(mapStateToProps, actions)(ProfileScreen);
