import { takeLatest } from 'redux-saga/effects'
import { Action } from '../Actions/Actions'

//Import handelers
import { handleGetUser } from './handlers/user.handler';
import { handler_get_appointments } from './handlers/appointments.handler';
import { handler_get_token } from './handlers/token.handlers';
import { handler_get_role } from './handlers/role.handler';
import { handler_get_location } from './handlers/location.handler';
import { handler_version } from './handlers/version.handle';
import { handler_online } from './handlers/online.handler';
import { handler_get_theme } from './handlers/theme.handler';

export function* watcherSaga() {
    yield takeLatest(Action.GET_USER.REQUEST, handleGetUser);
    yield takeLatest(Action.GET_APPOINTMENTS.REQUEST, handler_get_appointments);
    yield takeLatest(Action.GET_USER_TOKEN.REQUEST, handler_get_token);
    yield takeLatest(Action.GET_LOCATION.REQUEST, handler_get_location);
    yield takeLatest(Action.GET_ROLE.REQUEST, handler_get_role);
    yield takeLatest(Action.GET_VERSION_IS_CORRECT.REQUEST, handler_version);
    yield takeLatest(Action.GET_ONLINE.REQUEST, handler_online);
    yield takeLatest(Action.GET_THEME.REQUEST, handler_get_theme);
}