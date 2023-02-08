import { combineReducers } from 'redux'
import { UserData_reducer, Google_reducer, Facebook_reducer, FacebookUser_reducer, 
  Appointment_reducer, UserToken_reducer, Appointments_reducer, UserOnline_reducer, UserLocalisation_reducer,
  UserTheme_reducer, VersionIsCorrect_reducer } from './src/UserData_reducer';
import Role_reducer from './src/Role_reducer';


export default combineReducers({
  UserToken_reducer,
  /* Facebook_reducer,
  FacebookUser_reducer, */
  Google_reducer,
  UserData_reducer,
  Role_reducer,
  Appointments_reducer,
  Appointment_reducer,
  UserOnline_reducer,
  UserLocalisation_reducer,
  UserTheme_reducer,
  VersionIsCorrect_reducer
})