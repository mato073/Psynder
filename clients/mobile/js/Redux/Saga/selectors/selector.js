// USER
export const getUserData = state => state.UserData_reducer.userdata;

//Token
export const getUserToken = state => state.UserToken_reducer.token;

//Role
export const getUserRole = state => state.Role_reducer.role;

//Facebook
//export const getFacebookToken = state => state.Facebook_reducer.facebookToken;
//export const getFacebookUser = state => state.FacebookUser_reducer.userFacebook;

//Google
export const getGoogleUser = state => state.Google_reducer.googleUserData;

//Appointments
export const getAppointments = state => state.Appointments_reducer.appointments;
export const getAppointment = state => state.Appointment_reducer.appointment;

//Online
export const getOnline = state => state.UserOnline_reducer.online.data;

//Locatization
export const getLocalization = state => state.UserLocalisation_reducer.localization;

//Theme
export const getTheme = state => state.UserTheme_reducer.theme;

//Version
export const getVersionIsCorrect = state => state.VersionIsCorrect_reducer.version_is_correct;