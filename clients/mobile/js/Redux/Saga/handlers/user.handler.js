import { call, put } from 'redux-saga/effects'
import { requestGetUser } from '../requests/user.request';
import { get_user_data_success, get_user_data_error } from '../../Actions/Actions';

export function* handleGetUser(action) {
    try {
        const response = yield call(requestGetUser, action.isTherapist);
        const { data } = response;
        yield put(get_user_data_success(data));
    } catch (err) {
        yield put(get_user_data_error(err));
    }
}