import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';
import reducers from './Reducers/Combine_reducers';
import { watcherSaga } from './Saga/Saga'
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['UserToken_reducer', 'Facebook_reducer', 'Google_reducer', 'Role_reducer', 'UserTheme_reducer']
}

let condjehujdhe = compose;
if (__DEV__) {
  condjehujdhe = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}
const sagaMiddleware = createSagaMiddleware()

const middleware = [thunk, sagaMiddleware]

const persistedReducer = persistReducer(persistConfig, reducers)

const Store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));
sagaMiddleware.run(watcherSaga);

export default Store
