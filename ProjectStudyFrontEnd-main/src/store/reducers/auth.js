import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    error: null,
    username: "",
    userId: "",
    change: 0, 
    loading: false,
    info: null,
    verifyemail: false
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        username: action.username,
        userId: action.userId,
        error: null,
        loading: false
    });
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
}

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null,
        info: null
    });
}

const updateChange = (state, action) => {
    return updateObject(state, {
        change: state.change+=1,
    });
}

const resetError = (state, action) => {
    return updateObject(state, {
        error: null,
    });
}

const updateInfo = (state, action) => {
    return updateObject(state, {
        info: action.info,
        loading: false
    });
} 

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.UPDATE_CHANGE: return updateChange(state, action);
        case actionTypes.ERROR_CHANGE: return resetError(state, action);
        case actionTypes.INFO_CHANGE: return updateInfo(state, action);
        default:
            return state;
    }
}

export default reducer;