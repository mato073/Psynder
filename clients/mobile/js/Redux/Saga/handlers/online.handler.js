import { put } from 'redux-saga/effects'
import { get_online_success, get_online_error } from '../../Actions/Actions';

export function* handler_online(action) {
    try {
        yield put(get_online_success(action.online));
    } catch (err) {
        yield put(get_online_error(err));
    }
}