import { Action, LOGOUT } from '../../Actions/Actions'

const roleState = {
    role: {
        data: "User",
        loading: false,
        success: false,
        error: null
    }
};

function Role_reducer(state = roleState, action) {
    switch (action.type) {
        case Action.GET_ROLE.REQUEST:
            return {
                ...state,
                role: {
                    data: null,
                    loading: true,
                    success: false,
                    error: null,
                }
            };
        case Action.GET_ROLE.SUCCESS:
            return {
                ...state,
                role: {
                    data: action.data,
                    loading: false,
                    success: true,
                    error: null,
                }
            };
        case Action.GET_ROLE.FAILURE:
            return {
                ...state,
                role: {
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

export default Role_reducer;