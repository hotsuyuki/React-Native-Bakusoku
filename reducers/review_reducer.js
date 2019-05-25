import {
  FETCH_ALL_REVIEWS,
  SELECT_DETAIL_REVIEW,
} from '../actions/types';

const INITIAL_STATE = {
  allReviews: [],
  detailReview: [],
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ALL_REVIEWS:
      return { ...state, allReviews: action.payload };

    case SELECT_DETAIL_REVIEW:
      return { ...state, detailReview: action.payload };

    default:
      return state;
  }
};
