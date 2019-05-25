import Geocoder from 'react-native-geocoding';
import React from 'react';
import {
  Text, View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Modal,
  Dimensions, Platform
} from 'react-native';
import { MapView } from 'expo';
import { connect } from 'react-redux';

import * as actions from '../actions';


const SCREEN_WIDTH = Dimensions.get('window').width;
const MAP_ZOOM_RATE = 15.0;


class DetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMapLoaded: false,
      initialRegion: {
        latitude: 35.7090,
        longitude: 139.7320,
        latitudeDelta: MAP_ZOOM_RATE,
        longitudeDelta: MAP_ZOOM_RATE * 2.25
      },
      modalVisible: false,
      modalImageURI: require('../assets/image_placeholder.png')
    };
  }


  async componentDidMount() {
    //Geocoder.setApiKey('YOUR_GOOGLE_MAP_API_KEY');
    Geocoder.setApiKey('AIzaSyCzR5z2olEGKhpczyK0g53KNb5Kl-vHlX0');

    let result = await Geocoder.getFromLocation(this.props.detailReview.country);

    this.setState({
      isMapLoaded: true,
      initialRegion: {
        latitude: result.results[0].geometry.location.lat,
        longitude: result.results[0].geometry.location.lng,
        latitudeDelta: MAP_ZOOM_RATE,
        longitudeDelta: MAP_ZOOM_RATE * 2.25
      }
    });
  }

  renderImages() {
    const imageArray = [
    { isImage: false, uri: require('../assets/image_placeholder.png') },
    { isImage: false, uri: require('../assets/image_placeholder.png') },
    { isImage: false, uri: require('../assets/image_placeholder.png') },
  ];

  for (let i = 0; i < this.props.detailReview.imageURIs.length; i++) {
    imageArray[i].isImage = true;
    imageArray[i].uri = this.props.detailReview.imageURIs[i];
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {imageArray.map((image, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => this.setState({
              modalVisible: image.isImage,
              modalImageURI: image.uri
            })}
          >
            <Image
              style={{ height: SCREEN_WIDTH / 3, width: SCREEN_WIDTH / 3 }}
              source={image.uri}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


  render() {
    if (this.state.isMapLoaded === false) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Modal
          visible={this.state.modalVisible}
          animationType="fade"
          transparent={false}
        >
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => this.setState({ modalVisible: false })}
            >
              <Image
                style={{ height: SCREEN_WIDTH, width: SCREEN_WIDTH }}
                source={this.state.modalImageURI}
              />
            </TouchableOpacity>
          </View>
        </Modal>

        <ScrollView>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 30, padding: 5 }}>{this.props.detailReview.country}</Text>
            <Text style={{ padding: 5 }}>{this.props.detailReview.dateFrom} ~ {this.props.detailReview.dateTo}</Text>
          </View>

          <MapView
            style={{ height: SCREEN_WIDTH }}
            scrollEnabled={false}
            cacheEnabled={Platform.OS === 'android'}
            initialRegion={this.state.initialRegion}
          />

          {this.renderImages()}
        </ScrollView>
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    detailReview: state.review.detailReview
  };
};


export default connect(mapStateToProps, actions)(DetailScreen);
