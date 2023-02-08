import { call, put } from 'redux-saga/effects'
import { request_get_Location } from '../requests/location.request';
import { get_location_error, get_location_success } from '../../Actions/Actions';

export function* handler_get_location(action) {
    try {
        const response = yield call(request_get_Location, action.isTherapist);
        const { data } = response;
        if (data !== "") {
            const newLocalization = {
                lat: Number(data.location.lat.$numberDecimal),
                lng: Number(data.location.lng.$numberDecimal),
                address: data.location.formattedAddress
            }
            yield put(get_location_success(newLocalization));
        } else yield put(get_location_success(null));
    } catch (err) {
        yield put(get_location_error(err));
    }
}