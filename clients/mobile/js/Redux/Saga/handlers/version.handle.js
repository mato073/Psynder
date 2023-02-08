import { put } from 'redux-saga/effects'
import { get_version_success, get_version_error } from '../../Actions/Actions';

export function* handler_version(action) {
    try {
        yield put(get_version_success(action.version));
    } catch (err) {
        yield put(get_version_error(err));
    }
}