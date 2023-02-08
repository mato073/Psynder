import { call, put } from 'redux-saga/effects'
import { request_get_refreshToken } from '../requests/refreshToken.request';
import { get_refresh_Token_error, get_token_success, get_token_clean } from '../../Actions/Actions';

export function* handler_get_refreshToken(action) {
    try {
        const response = yield call(request_get_refreshToken, action.refreshtoken);
        const { data } = response;
        yield put(get_token_success(data));
    } catch (err) {
        yield put(get_token_clean());
        yield put(get_refresh_Token_error(err));
    }
}