import { put } from 'redux-saga/effects'
import { get_role_success, get_role_error } from "../../Actions/Actions";

export function* handler_get_role(action) {
    try {
        yield put(get_role_success(action.isTherapist));
    } catch (err) {
        yield put(get_role_error(err));
    }
}