import { Action, LOGOUT } from '../../Actions/Actions'

const initialState = {
    facebookToken: {
        data: null,
        loading: false,
        success: false,
        error: null
    },
    userFacebook: {
        data: null,
        loading: false,
        success: false,
        error: null
    },
    appointment: {
        data: null,
        loading: false,
        success: false,
        error: null
    }
};

const appointmentsState = {
    appointments: {
        data: null,
        loading: false,
        success: false,
        error: null
    },
}

const userDataState = {
    userdata: {
        data: null,
        loading: false,
        success: false,
        error: null
    },
}

const tokenState = {
    token: {
        data: null,
        loading: false,
        success: false,
        error: null
    },
}

const googleState = {
    googleUserData: {
        data: null,
        loading: false,
        success: false,
        error: null
    }
}

const onlineState = {
    online: {
        data: null,
        loading: false,
        success: false,
        error: null
    }
}

const localizationState = {
    localization: {
        data: null,
        loading: false,
        success: false,
        error: null
    },
}

const themeState = {
    theme: {
        data: "light",
        loading: false,
        success: false,
        error: null
    }
}

const versionState = {
    version_is_correct: {
        data: null,
        loading: false,
        success: false,
        error: null
    }
}

export function UserToken_reducer(state = tokenState, action) {
    switch (action.type) {
        case Action.GET_USER_TOKEN.REQUEST:
            return {
                ...state,
                token: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_USER_TOKEN.SUCCESS:
            return {
                ...state,
                token: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_USER_TOKEN.FAILURE:
            return {
                ...state,
                token: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        case Action.GET_USER_TOKEN.CLEAN:
            return {
                ...state,
                token: {
                    data: null,
                    loading: false,
                    success: false,
                    error: null,
                }
            };
        case LOGOUT:
            return {
                token: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            }
        default:
            return state;
    }
}

export function UserData_reducer(state = userDataState, action) {
    switch (action.type) {
        case Action.GET_USER.REQUEST:
            return {
                ...state,
                userdata: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_USER.SUCCESS:
            return {
                ...state,
                userdata: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_USER.FAILURE:
            return {
                ...state,
                userdata: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        case LOGOUT:
            return {
                userdata: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            }
        default:
            return state;
    }
}

/* export function Facebook_reducer(state = initialState.facebookToken, action) {
    switch (action.type) {
        case Action.GET_TOKEN_FACEBOOK.REQUEST:
            return {
                ...state,
                facebookToken: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_TOKEN_FACEBOOK.SUCCESS:
            return {
                ...state,
                facebookToken: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_TOKEN_FACEBOOK.FAILURE:
            return {
                ...state,
                facebookToken: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        case LOGOUT:
            return {
                facebookToken: null
            }
        default:
            return state;
    }
}

export function FacebookUser_reducer(state = initialState.userFacebook, action) {
    switch (action.type) {
        case Action.GET_USER_FACEBOOK.REQUEST:
            return {
                ...state,
                userFacebook: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_USER_FACEBOOK.SUCCESS:
            return {
                ...state,
                userFacebook: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_USER_FACEBOOK.FAILURE:
            return {
                ...state,
                userFacebook: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        case LOGOUT:
            return {
                userFacebook: null
            }
        default:
            return state;
    }
} */

export function Google_reducer(state = googleState, action) {
    switch (action.type) {
        case Action.GET_USER_GOOGLE.REQUEST:
            return {
                ...state,
                googleUserData: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_USER_GOOGLE.SUCCESS:
            return {
                ...state,
                googleUserData: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_USER_GOOGLE.FAILURE:
            return {
                ...state,
                googleUserData: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        case LOGOUT:
            return {
                googleUserData: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            }
        default:
            return state;
    }
}

export function Appointments_reducer(state = appointmentsState, action) {
    switch (action.type) {
        case Action.GET_APPOINTMENTS.REQUEST:
            return {
                ...state,
                appointments: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_APPOINTMENTS.SUCCESS:
            return {
                ...state,
                appointments: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_APPOINTMENTS.FAILURE:
            return {
                ...state,
                appointments: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        case LOGOUT:
            return {
                appointments: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            }
        default:
            return state;
    }
}

export function Appointment_reducer(state = initialState.appointment, action) {
    switch (action.type) {
        case Action.GET_APPOINTMENT.REQUEST:
            return {
                ...state,
                appointment: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_APPOINTMENT.SUCCESS:
            return {
                ...state,
                appointment: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_APPOINTMENT.FAILURE:
            return {
                ...state,
                appointment: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        case LOGOUT:
            return {
                appointment: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            }
        default:
            return state;
    }
}

export function UserOnline_reducer(state = onlineState, action) {
    switch (action.type) {
        case Action.GET_ONLINE.REQUEST:
            return {
                ...state,
                online: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_ONLINE.SUCCESS:
            return {
                ...state,
                online: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_ONLINE.FAILURE:
            return {
                ...state,
                online: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        default:
            return state;
    }
}

export function UserLocalisation_reducer(state = localizationState, action) {
    switch (action.type) {
        case Action.GET_LOCATION.REQUEST:
            return {
                ...state,
                localization: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_LOCATION.SUCCESS:
            return {
                ...state,
                localization: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_LOCATION.FAILURE:
            return {
                ...state,
                localization: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        case LOGOUT:
            return {
                localization: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            }
        default:
            return state;
    }
}

export function UserTheme_reducer(state = themeState, action) {
    switch (action.type) {
        case Action.GET_THEME.REQUEST:
            return {
                ...state,
                theme: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_THEME.SUCCESS:
            return {
                ...state,
                theme: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_THEME.FAILURE:
            return {
                ...state,
                theme: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        default:
            return state;
    }
}

export function VersionIsCorrect_reducer(state = versionState, action) {
    switch (action.type) {
        case Action.GET_VERSION_IS_CORRECT.REQUEST:
            return {
                ...state,
                version_is_correct: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_VERSION_IS_CORRECT.SUCCESS:
            return {
                ...state,
                version_is_correct: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_VERSION_IS_CORRECT.FAILURE:
            return {
                ...state,
                version_is_correct: {
                    data: null,
                    loading: false,
                    success: false,
                    error: action.error,
                }
            };
        default:
            return state;
    }
}