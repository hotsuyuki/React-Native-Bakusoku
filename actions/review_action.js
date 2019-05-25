import { AsyncStorage } from 'react-native';

import {
  FETCH_ALL_REVIEWS,
  SELECT_DETAIL_REVIEW,
} from './types';


export const fetchAllReviews = () => {
  return async (dispatch) => {
    let stringifiedAllReviews = await AsyncStorage.getItem('allReviews');
    let allReviews = JSON.parse(stringifiedAllReviews);

    if (allReviews === null) {
      allReviews = [];
      await AsyncStorage.setItem('allReviews', JSON.stringify(allReviews));
    }

    dispatch({ type: FETCH_ALL_REVIEWS, payload: allReviews });
  };
};

export const selectDetailReview = (selectedReview) => {
  return { type: SELECT_DETAIL_REVIEW, payload: selectedReview };
};
