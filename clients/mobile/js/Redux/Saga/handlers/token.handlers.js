import { call, put } from 'redux-saga/effects'
import { request_get_token } from '../requests/token.request';
import { get_token_success, get_token_error } from '../../Actions/Actions';

export function* handler_get_token(action) {
    try {
        const response = yield call(request_get_token, action);
        const { data } = response;
        yield put(get_token_success(data));
    } catch (err) {
        console.log('err get token =', err);
        yield put(get_token_error(err));
    }
}