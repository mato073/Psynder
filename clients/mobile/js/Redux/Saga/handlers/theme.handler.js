import { put } from 'redux-saga/effects'
import { get_theme_success, get_theme_error } from "../../Actions/Actions";

export function* handler_get_theme(action) {
    try {
        yield put(get_theme_success(action.theme));
    } catch (err) {
        yield put(get_theme_error(err));
    }
}