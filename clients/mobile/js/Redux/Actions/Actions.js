import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from '@env';

import axiosInstance from '../../../helpers/axios'

const base_url = BASE_URL;

const actionCreateHeader = (type) => {
  return {
    REQUEST: `${type}/REQUEST`,
    SUCCESS: `${type}/SUCCESS`,
    FAILURE: `${type}/FAILURE`,
  }
}
export const LOGOUT = "LOGOUT";
export const GET_LOCATION = actionCreateHeader('GET_LOCATION');
export const GET_USER = actionCreateHeader('GET_USER');
export const GET_USER_GOOGLE = actionCreateHeader('GET_USER_GOOGLE');
export const GET_ROLE = actionCreateHeader('GET_ROLE');
export const GET_APPOINTMENTS = actionCreateHeader('GET_APPOINTMENTS');
export const GET_APPOINTMENT = actionCreateHeader('GET_APPOINTMENT');
export const GET_ONLINE = actionCreateHeader('GET_ONLINE');
export const GET_THEME = actionCreateHeader('GET_THEME');
export const GET_VERSION_IS_CORRECT = actionCreateHeader('GET_VERSION_IS_CORRECT');
export const GET_USER_TOKEN = {
  REQUEST: `GET_USER_TOKEN/REQUEST`,
  SUCCESS: `GET_USER_TOKEN/SUCCESS`,
  FAILURE: `GET_USER_TOKEN/FAILURE`,
  CLEAN: `GET_USER_TOKEN/CLEAN`
}
export const GET_REFRESH_TOKEN = actionCreateHeader('GET_REFRESH_TOKEN');

export const Action = {
  GET_ROLE,
  GET_USER,
  GET_LOCATION,
  GET_USER_GOOGLE,
  GET_APPOINTMENTS,
  GET_APPOINTMENT,
  GET_ONLINE,
  GET_THEME,
  GET_VERSION_IS_CORRECT,
  GET_USER_TOKEN,
  GET_REFRESH_TOKEN
}

/**
 * GET USER DATA
 */
export const get_user_data_request = (isTherapist) => ({
  type: GET_USER.REQUEST,
  isTherapist
});

export const get_user_data_success = (data) => ({
  type: GET_USER.SUCCESS,
  data,
});

export const get_user_data_error = (error) => ({
  type: GET_USER.FAILURE,
  error,
});

/**
 * GET USER LOCATION
 */
export const get_location_request = (isTherapist) => ({
  type: GET_LOCATION.REQUEST,
  isTherapist
});

export const get_location_success = (data) => ({
  type: GET_LOCATION.SUCCESS,
  data,
});

export const get_location_error = (error) => ({
  type: GET_LOCATION.FAILURE,
  error,
});

/**
 * GET USER ROLE
 */
export const get_role_request = (isTherapist) => ({
  type: GET_ROLE.REQUEST,
  isTherapist
});

export const get_role_success = (data) => ({
  type: GET_ROLE.SUCCESS,
  data,
});

export const get_role_error = (error) => ({
  type: GET_ROLE.FAILURE,
  error,
});

/**
 * GET USER TOKEN
 */
export const get_token_request = (email, password, isTherapist, provider) => ({
  type: GET_USER_TOKEN.REQUEST,
  email,
  password,
  isTherapist,
  provider
});

export const get_token_success = (data) => ({
  type: GET_USER_TOKEN.SUCCESS,
  data,
});

export const get_token_error = (error) => ({
  type: GET_USER_TOKEN.FAILURE,
  error,
});

export const get_token_clean = () => ({
  type: GET_USER_TOKEN.CLEAN,
});

/**
 * GET USER APPOINTMENTS
 */
export const get_appointments_request = (isTherapist) => ({
  type: GET_APPOINTMENTS.REQUEST,
  isTherapist
});

export const get_appointments_success = (data) => ({
  type: GET_APPOINTMENTS.SUCCESS,
  data,
});

export const get_appointments_error = (error) => ({
  type: GET_APPOINTMENTS.FAILURE,
  error,
});

/**
 * GET USER APPOINTMENT
 */
export const get_appointment_request = (isTherapist) => ({
  type: GET_APPOINTMENT.REQUEST,
  isTherapist
});

export const get_appointment_success = (data) => ({
  type: GET_APPOINTMENT.SUCCESS,
  data,
});

export const get_appointment_error = (error) => ({
  type: GET_APPOINTMENT.FAILURE,
  error,
});

/**
 * GET USER VERSION
 */
export const get_version_request = (version) => ({
  type: GET_VERSION_IS_CORRECT.REQUEST,
  version
});

export const get_version_success = (data) => ({
  type: GET_VERSION_IS_CORRECT.SUCCESS,
  data,
});

export const get_version_error = (error) => ({
  type: GET_VERSION_IS_CORRECT.FAILURE,
  error,
});

/**
 * GET USER ONLINE
 */
export const get_online_request = (online) => ({
  type: GET_ONLINE.REQUEST,
  online
});

export const get_online_success = (data) => ({
  type: GET_ONLINE.SUCCESS,
  data,
});

export const get_online_error = (error) => ({
  type: GET_ONLINE.FAILURE,
  error,
});

/**
 * GET USER THEME
 */
export const get_theme_request = (theme) => ({
  type: GET_THEME.REQUEST,
  theme
});

export const get_theme_success = (data) => ({
  type: GET_THEME.SUCCESS,
  data,
});

export const get_theme_error = (error) => ({
  type: GET_THEME.FAILURE,
  error,
});

/**
 * GET USER GOOGLE
 */
export const get_user_google_request = (isTherapist) => ({
  type: GET_USER_GOOGLE.REQUEST,
  isTherapist
});

export const get_user_google_success = (data) => ({
  type: GET_USER_GOOGLE.SUCCESS,
  data,
});

export const get_user_google_error = (error) => ({
  type: GET_USER_GOOGLE.FAILURE,
  error,
});

/**
 * GET REFRESH TOKEN
 */
export const get_refresh_Token_request = (refreshToken) => ({
  type: GET_REFRESH_TOKEN.REQUEST,
  refreshToken
});

export const get_refresh_Token_success = (data) => ({
  type: GET_REFRESH_TOKEN.SUCCESS,
  data,
});

export const get_refresh_Token_error = (error) => ({
  type: GET_REFRESH_TOKEN.FAILURE,
  error,
});

/* export function send_role(role) {
  return {
    type: ROLE,
    role: role,
  };
}

export function send_userdata_google(userdata) {
  return {
    type: USERDATA_GOOGLE,
    googleUserData: userdata,
  };
}

export function send_token_facebook(token) {
  return {
    type: TOKEN_FACEBOOK,
    token: token,
  };
}

export function send_userdata(userdata) {
  return {
    type: USER_DATA,
    userdata: userdata,
  };
}

export function send_logout() {
  return {
    type: LOGOUT,
  };
}

export function send_token(token) {
  return {
    type: USER_TOKEN,
    token: token,
  };
}

export function send_appointments(appointments) {
  return {
    type: APPOINTMENTS,
    appointments: appointments,
  };
}
export function send_appointment(appointment) {
  return {
    type: APPOINTMENT,
    appointment: appointment,
  };
}

export function set_online(state) {
  return {
    type: ONLINE,
    online: state,
  };
}

export function set_theme(state) {
  return {
    type: THEME,
    theme: state,
  };
}

export function set_version_is_correct(state) {
  return {
    type: VERSION_IS_CORRECT,
    version_is_correct: state,
  };
} */

export function send_logout() {
  return {
    type: LOGOUT,
  };
}

export function set_localization(localization) {
  let newLocalization = {
    lat: Number(localization.location.lat.$numberDecimal),
    lng: Number(localization.location.lng.$numberDecimal),
    address: localization.location.formattedAddress
  }
  return {
    type: LOCALIZATION,
    localization: newLocalization,
  };
}

/* export function set_role(role) {
  return (dispatch) => {
    dispatch(send_role(role));
  };
} */

export function set_userdata_google(userdata) {
  return (dispatch) => {
    console.log('Google userdata store...');
    dispatch(send_userdata_google(userdata));
    return Promise.resolve();
  };
}


/* export async function set_user_google(isTherapist, userdata) {

  await new_google_user(isTherapist, userdata.user.id, 'GOOGLE', userdata.user.email, userdata.user.givenName, userdata.user.familyName);
}

export function login_media(isTherapist, uid, provider) {
  const url = isTherapist ? `${base_url}/therapists/social/login` : `${base_url}/users/social/login`;
  //const url = isTherapist ? `http://10.0.2.2:8080/therapists/social/login` : `http://10.0.2.2:8080/users/social/login`;
  const params = new URLSearchParams();
  params.append('uid', uid);
  params.append('provider', provider);

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  console.log('parames', params);

  return async (dispatch) => {
    try {
      await axios.post(url, params, config).then((response) => {
        console.log('response', response.data);
        dispatch(send_token(response.data));
      });
      return true;
    } catch (err) {
      console.log("err setToken:", err)
      return err;
    }
  };
}
 */

export function set_token_facebook(token) {
  return (dispatch) => {
    console.log('Facebook token store...');
    dispatch(send_token_facebook(token));
  };
}

export function facebook_user(token) {
  return async (dispatch) => {
    try {
      return await fetch(
        'https://graph.facebook.com/v9.0/me?fields=id,name,email,picture.width(400).height(400)&access_token=' +
        token,
        {
          method: 'get',
        },
      )
        .then((response) => response.json())
        .then((res) => {
          const userInfos = {
            email: res.email,
            image: res.picture.data.url,
            name: res.name,
            id: res.id,
          };
          dispatch(send_userdata(userInfos));
        });
    } catch (err) {
      console.log('facebook graph error:', err);
    }
  };
}

export function set_token(email, password, isTherapist) {
  /*   const url = isTherapist
      ? `${base_url}/therapists/login`
      : `${base_url}/users/login`; */
  const url = isTherapist ? `http://10.0.2.2:8080/therapists/login` : `http://10.0.2.2:8080/users/login`;

  const params = new URLSearchParams();
  params.append('password', password);
  params.append('email', email);

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  return async (dispatch) => {
    try {
      await axios.post(url, params, config).then((response) => {
        dispatch(send_token(response.data));
      });
      return true;
    } catch (err) {
      console.log("err setToken:", err.response.data.message)
      return err.response.data.message;
    }
  };
}


export async function refreshToken(refreshToken) {
  const url = `${base_url}/token/refresh`
  /* const url = 'http://10.0.2.2:8080/token/refresh' */
  let result;

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  const params = new URLSearchParams();
  params.append('refreshToken', refreshToken);
  try {
    result = await axios.post(url, params, config)
  } catch (err) {
    return false;
  }
  return result.data;
}


/* export function get_user(isTherapist) { */
/* const url = isTherapist
  ? `${base_url}/therapists/current`s
  : `${base_url}/users/current`;
console.log('istera =', isTherapist); */
/*   const url = isTherapist ? `http://10.0.2.2:8080/therapists/current` : `http://10.0.2.2:8080/users/current`;
  return async (dispatch) => {
    try {
      return axiosInstance().get(url).then((response) => {
        console.log(response.data)
        dispatch(send_userdata(response.data));
      })
    } catch (err) {
      console.log('err getUser:', err.data);
    }
  };
}
 */
export function logOut() {
  AsyncStorage.clear();
  return async (dispatch) => {
    //await dispatch(get_token_clean());
    await dispatch(send_logout());
  };
}

export function get_appointments(isTherapist, startDate, endDate) {
  /* const url = isTherapist
    ? `${base_url}/therapists/current/appointments`
    : `${base_url}/users/current/appointments`; */
  const url = isTherapist ? `http://10.0.2.2:8080/therapists/current/appointments` : `http://10.0.2.2:8080/users/current/appointments`;
  const params = new URLSearchParams();
  if (startDate)
    params.append('startDate', startDate);
  if (endDate)
    params.append('endDate', endDate);

  if (params._searchParams.length === 0) {
    return async (dispatch) => {
      try {
        return await axiosInstance().get(url).then((response) => {
          dispatch(send_appointments(response.data));

        });
      } catch (err) {
        console.log('err setAppointements:', err);
      }
    }
  } else {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return async (dispatch) => {
      try {
        return await axiosInstance().get(url, params, config).then((response) => {
          dispatch(send_appointments(response.data));
        });
      } catch (err) {
        console.log('err setAppointements:', err);
      }
    }
  }
}

export function get_location(isTherapist) {
  /* const url = isTherapist
    ? `${base_url}/therapists/current/location`
    : `${base_url}/users/current/location`; */
  const url = isTherapist ? `http://10.0.2.2:8080/therapists/current/location` : `http://10.0.2.2:8080/users/current/location`;

  let result;
  try {
    return async (dispatch) => {
      result = await axiosInstance().get(url);
      if (result.data.length !== 0) {
        dispatch(set_localization(result.data));
      }
    }
  } catch (err) {
    console.log('err getlocation:', err);
    return null;
  }
}
