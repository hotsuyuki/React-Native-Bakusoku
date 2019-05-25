import { combineReducers } from 'redux';

import ReviewReducer from './review_reducer';


export default combineReducers({
  review: ReviewReducer,
});
