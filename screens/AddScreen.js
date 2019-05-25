import Geocoder from 'react-native-geocoding';
import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Picker, DatePickerIOS, TouchableOpacity, Image,
  Dimensions, LayoutAnimation, UIManager, Platform, AsyncStorage
} from 'react-native';
import { Header, ListItem, Icon, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { MapView, Permissions, ImagePicker } from 'expo';
import { connect } from 'react-redux';

import * as actions from '../actions';


const GREAT = 'sentiment-very-satisfied';
const GREAT_COLOR = 'red';
const GOOD = 'sentiment-satisfied';
const GOOD_COLOR = 'orange';
const POOR = 'sentiment-dissatisfied';
const POOR_COLOR = 'blue';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MAP_ZOOM_RATE = 15.0;

const INITIAL_STATE = {
  countryPickerVisible: false,
  dateFromPickerVisible: false,
  dateToPickerVisible: false,

  chosenDateFrom: new Date().toLocaleString('ja'),
  chosenDateTo: new Date().toLocaleString('ja'),

  tripDetail: {
    country: 'Select Counrty',
    dateFrom: 'From',
    dateTo: 'To',
    imageURIs: [
      require('../assets/add_image_placeholder.png'),
      require('../assets/add_image_placeholder.png'),
      require('../assets/add_image_placeholder.png'),
    ],
    rank: '',
  },

  initialRegion: {
    latitude: 35.658581, // Tokyo tower
    longitude: 139.745433, // Tokyo tower
    latitudeDelta: MAP_ZOOM_RATE,
    longitudeDelta: MAP_ZOOM_RATE * 2.25
  },
};


class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }


  componentDidUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }


  renderCountryPicker() {
    if (this.state.countryPickerVisible === true) {
      return (
        <Picker
          selectedValue={this.state.tripDetail.country}
          onValueChange={async (itemValue) => {
            Geocoder.setApiKey(' /* YOUR_GOOGLE_MAP_API_KEY */ ');

            let result = await Geocoder.getFromLocation(itemValue);

            this.setState({
              ...this.state,
              tripDetail: {
                ...this.state.tripDetail,
                country: itemValue
              },
              initialRegion: {
                latitude: result.results[0].geometry.location.lat,
                longitude: result.results[0].geometry.location.lng,
                latitudeDelta: MAP_ZOOM_RATE,
                longitudeDelta: MAP_ZOOM_RATE * 2.25
              }
            });
          }}
        >
          <Picker.Item label={INITIAL_STATE.tripDetail.country} value={INITIAL_STATE.tripDetail.country} />
          <Picker.Item label="China" value="China" />
          <Picker.Item label="UK" value="UK" />
          <Picker.Item label="USA" value="USA" />
        </Picker>
      );
    }
  }


  renderDateFromPicker() {
    if (this.state.dateFromPickerVisible) {
      switch (Platform.OS) {
        case 'ios':
          return (
            <DatePickerIOS
              mode="date"
              date={new Date(this.state.chosenDateFrom)}
              onDateChange={(date) => {
                // `date` = "Thu Oct 04 2018 17:00:00 GMT+0900 (JST)"

                // "Thu Oct 04 2018 17:00:00 GMT+0900 (JST)" ---> "2018/10/04 17:00:00"
                const dateString = date.toLocaleString('ja');

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateFrom: dateString.split(' ')[0] // "2018/10/04 17:00:00" ---> "2018/10/04"
                  },
                  chosenDateFrom: dateString,
                  chosenDateTo: dateString
                });
              }}
            />
          );

        case 'android':
          return (
            <DatePicker
              mode="date"
              date={new Date(this.state.chosenDateFrom)}
              format="YYYY-MM-DD"
              confirmBtnText="OK"
              cancelBtnText="キャンセル"
              onDateChange={(date) => {
                // `date` = "2018-10-04 17:00"

                // "2018-10-04 17:00" ---> "2018-10-04 17:00:00"
                let dateString = `${date}:00`;

                // "2018-10-04 17:00:00" ---> "2018/10/04 17:00:00"
                dateString = dateString.replace(/-/g, '/');

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateFrom: dateString.split(' ')[0] // "2018/10/04 17:00:00" ---> "2018/10/04"
                  },
                  chosenDateFrom: dateString,
                  chosenDateTo: dateString
                });
              }}
            />
          );

        default:
          return <View />;
      }
    }
  }


  renderDateToPicker() {
    if (this.state.dateToPickerVisible) {
      switch (Platform.OS) {
        case 'ios':
          return (
            <DatePickerIOS
              mode="date"
              minimumDate={new Date(this.state.chosenDateFrom)}
              date={new Date(this.state.chosenDateTo)}
              onDateChange={(date) => {
                // `date` = "Thu Oct 04 2018 17:00:00 GMT+0900 (JST)"

                // "Thu Oct 04 2018 17:00:00 GMT+0900 (JST)" ---> "2018/10/04 17:00:00"
                const dateString = date.toLocaleString('ja');

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateTo: dateString.split(' ')[0] // "2018/10/04 17:00:00" ---> "2018/10/04"
                  },
                  chosenDateTo: dateString
                });
              }}
            />
          );

        case 'android':
          return (
            <DatePicker
              mode="date"
              minDate={new Date(this.state.chosenDateFrom)}
              date={new Date(this.state.chosenDateTo)}
              format="YYYY-MM-DD"
              confirmBtnText="OK"
              cancelBtnText="キャンセル"
              onDateChange={(date) => {
                // `date` = "2018-10-04 17:00"

                // "2018-10-04 17:00" ---> "2018-10-04 17:00:00"
                let dateString = `${date}:00`;

                // "2018-10-04 17:00:00" ---> "2018/10/04 17:00:00"
                dateString = dateString.replace(/-/g, '/');

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateTo: dateString.split(' ')[0] // "2018/10/04 17:00:00" ---> "2018/10/04"
                  },
                  chosenDateTo: dateString
                });
              }}
            />
          );

        default:
          return <View />;
      }
    }
  }

  renderMap() {
    if (
      this.state.tripDetail.country !== INITIAL_STATE.tripDetail.country &&
      this.state.countryPickerVisible === false
    ) {
      return (
        <MapView
          style={{ height: SCREEN_WIDTH }}
          scrollEnabled={false}
          cacheEnabled={Platform.OS === 'android'}
          initialRegion={this.state.initialRegion}
        />
      );
    }
  }

  onImagePress = async (index) => {
    let cameraRollPermission = await AsyncStorage.getItem('cameraRollPermission');

    if (cameraRollPermission !== 'granted') {
      let permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (permission.status !== 'granted') {
        return;
      }

      await AsyncStorage.setItem('cameraRollPermission', permission.status);
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true
    });

    if (!result.cancelled) {
      const newImageURIs = this.state.tripDetail.imageURIs;
      newImageURIs[index] = { uri: result.uri };

      this.setState({
        ...this.state,
        tripDetail: {
          ...this.state.tripDetail,
          imageURIs: newImageURIs
        }
      });
    }
  }


  renderImagePicker() {
    if (
      this.state.tripDetail.country !== INITIAL_STATE.tripDetail.country &&
      this.state.countryPickerVisible === false
    ) {
      return (
        <View style={{ flexDirection: 'row' }}>
          {this.state.tripDetail.imageURIs.map((imageURI, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => this.onImagePress(index)}
              >
                <Image
                  style={{
                    width: SCREEN_WIDTH / this.state.tripDetail.imageURIs.length,
                    height: SCREEN_WIDTH / this.state.tripDetail.imageURIs.length
                  }}
                  source={imageURI}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
  }


  renderReviewButtons() {
    if (
      this.state.tripDetail.country !== INITIAL_STATE.tripDetail.country &&
      this.state.countryPickerVisible === false
    ) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 10
          }}
        >
          <Icon
            raised
            size={40}
            name={GREAT}
            color={this.state.tripDetail.rank === GREAT ? GREAT_COLOR : 'gray'}
            onPress={() => this.setState({
              ...this.state,
              tripDetail: {
                ...this.state.tripDetail,
                rank: GREAT
              }
            })}
          />
          <Icon
            raised
            size={40}
            name={GOOD}
            color={this.state.tripDetail.rank === GOOD ? GOOD_COLOR : 'gray'}
            onPress={() => this.setState({
              ...this.state,
              tripDetail: {
                ...this.state.tripDetail,
                rank: GOOD
              }
            })}
          />
          <Icon
            raised
            size={40}
            name={POOR}
            color={this.state.tripDetail.rank === POOR ? POOR_COLOR : 'gray'}
            onPress={() => this.setState({
              ...this.state,
              tripDetail: {
                ...this.state.tripDetail,
                rank: POOR
              }
            })}
          />
        </View>
      );
    }
  }


  onAddButtonPress = async () => {
    const newImageURIs = [];
    for (let i = 0; i < this.state.tripDetail.imageURIs.length; i++) {
      if (this.state.tripDetail.imageURIs[i] !== require('../assets/add_image_placeholder.png')) {
        newImageURIs.push(this.state.tripDetail.imageURIs[i]);
      }
    }

    const tripDetail = this.state.tripDetail;
    tripDetail.imageURIs = newImageURIs;

    let stringifiedAllReviews = await AsyncStorage.getItem('allReviews');
    let allReviews = JSON.parse(stringifiedAllReviews);

    if (allReviews === null) {
      allReviews = [];
    }

    allReviews.push(tripDetail);

    try {
      await AsyncStorage.setItem('allReviews', JSON.stringify(allReviews));
    } catch (e) {
      console.warn(e);
    }

    this.props.fetchAllReviews();

    this.setState({
      ...INITIAL_STATE,
      tripDetail: {
        ...INITIAL_STATE.tripDetail,
        imageURIs: [
          require('../assets/add_image_placeholder.png'),
          require('../assets/add_image_placeholder.png'),
          require('../assets/add_image_placeholder.png'),
        ]
      }
    });

    this.props.navigation.navigate('home');
  }


  renderAddButton() {
    let isComplete = true;

    Object.keys(this.state.tripDetail).forEach((key) => {
      if (
        key !== 'imageURIs' &&
        this.state.tripDetail[key] === INITIAL_STATE.tripDetail[key]
      ) {
        isComplete = false;
      }
    });

    return (
      <View style={{ padding: 20 }}>
        <Button
          title="Add"
          color="white"
          buttonStyle={{ backgroundColor: 'deepskyblue' }}
          onPress={() => this.onAddButtonPress()}
          disabled={isComplete === false}
        />
      </View>
    );
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          statusBarProps={{ barStyle: 'light-content' }}
          backgroundColor="deepskyblue"
          leftComponent={{
            icon: 'close',
            color: 'white',
            onPress: () => {
              this.setState({
                ...INITIAL_STATE,
                tripDetail: {
                  ...INITIAL_STATE.tripDetail,
                  imageURIs: [
                    require('../assets/add_image_placeholder.png'),
                    require('../assets/add_image_placeholder.png'),
                    require('../assets/add_image_placeholder.png'),
                  ]
                }
              });

              this.props.navigation.navigate('home');
            }
          }}
          centerComponent={{ text: 'Add', style: styles.headerStyle }}
        />

        <ScrollView style={{ flex: 1 }}>
          <ListItem
            title="Country: "
            subtitle={
              <View style={styles.listItemStyle}>
                <Text
                  style={{
                    fontSize: 18,
                    color: this.state.tripDetail.country === INITIAL_STATE.tripDetail.country ? 'gray' : 'black'
                  }}
                >
                  {this.state.tripDetail.country}
                </Text>
              </View>
            }
            rightIcon={{ name: this.state.countryPickerVisible === true ? 'keyboard-arrow-up' : 'keyboard-arrow-down' }}
            onPress={() => this.setState({
              countryPickerVisible: !this.state.countryPickerVisible,
              dateFromPickerVisible: false,
              dateToPickerVisible: false,
            })}
          />

          {this.renderCountryPicker()}

          <ListItem
            title="Date: "
            subtitle={
              <View style={styles.listItemStyle}>
                <Text
                  style={{
                    fontSize: 18,
                    color: this.state.tripDetail.dateFrom === INITIAL_STATE.tripDetail.dateFrom ? 'gray' : 'black'
                  }}
                >
                  {this.state.tripDetail.dateFrom}
                </Text>
              </View>
            }
            rightIcon={{ name: this.state.dateFromPickerVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down' }}
            onPress={() => this.setState({
              countryPickerVisible: false,
              dateFromPickerVisible: !this.state.dateFromPickerVisible,
              dateToPickerVisible: false
            })}
          />

          {this.renderDateFromPicker()}

          <ListItem
            title=""
            subtitle={
              <View style={styles.listItemStyle}>
                <Text
                  style={{
                    fontSize: 18,
                    color: this.state.tripDetail.dateTo === INITIAL_STATE.tripDetail.dateTo ? 'gray' : 'black'
                  }}
                >
                  {this.state.tripDetail.dateTo}
                </Text>
              </View>
            }
            rightIcon={{ name: this.state.dateToPickerVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down' }}
            onPress={() => this.setState({
              countryPickerVisible: false,
              dateFromPickerVisible: false,
              dateToPickerVisible: !this.state.dateToPickerVisible
            })}
          />

          {this.renderDateToPicker()}

          {this.renderMap()}

          {this.renderImagePicker()}

          {this.renderReviewButtons()}

          {this.renderAddButton()}

        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  headerStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
});


const mapStateToProps = (state) => {
  return {
    allReviews: state.review.allReviews,
  };
};


export default connect(mapStateToProps, actions)(AddScreen);
