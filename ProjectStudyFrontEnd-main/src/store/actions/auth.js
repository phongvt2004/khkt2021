import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as api from '../../api';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, username, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username,
        userId: userId
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(api.api_signin, {
            username: username,
            password: password
        })
        .then(res => {
            if ("token" in res.data)
            {
                const token = res.data.token;
                const userId = res.data.userId;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7);
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('userId', userId);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token, username, userId));
                dispatch(getInfostatus(token, username, userId));
                dispatch(checkAuthTimeout(3600 * 24 * 7));
            }
            else {
                if ("msg" in res.data)
                {
                    dispatch(authFail(res.data))
                }
                else {
                    dispatch(authFail({ msg: "System error"}))
                }
            }
        })
        .catch(function (error) {
            dispatch(authFail({ msg: "System error"}))
            console.log(error)
        })
    }
}

export const authSignup = (fullname, username, email, password, confirmPassword, gender, classs, goodAt=[], badAt=[]) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(api.api_signup, {
            fullname: fullname,
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            gender: gender,
            class: parseInt(classs),
            goodAt: goodAt,
            badAt: badAt,
            groupIds: [],
            isAdmin: false,
            isConfirmMail: false
        })
        .then(res => {
            // console.log(res.data)
            console.log("token" in res.data)
            if ("token" in res.data)
            {
                const token = res.data.token;
                const userId = res.data.userId;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7);
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('userId', userId);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token, username, userId));
                dispatch(getInfostatus(token, username, userId));
                dispatch(checkAuthTimeout(3600 * 24 * 7));
            }
            else {
                if ("msg" in res.data)
                {
                    dispatch(authFail(res.data))
                }
                else {
                    dispatch(authFail({ msg: "System error"}))
                }
            }
        })
        .catch(function (error) {
            dispatch(authFail({ msg: "System error"}))
        })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if ( expirationDate <= new Date() ) {
                dispatch(logout());
            } else {
                const username = localStorage.getItem('username');
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, username, userId));
                dispatch(getInfostatus(token, username, userId));
                dispatch(checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000) );
            }
        }
    }
}


export const updateChange = () => {
    return {
        type: actionTypes.UPDATE_CHANGE,
    }
}

export const errReset = () => {
    return {
        type: actionTypes.ERROR_CHANGE,
    }
}

export const updateInfo = info => {
    return {
        type: actionTypes.INFO_CHANGE,
        info: info
    }
}

export const getInfostatus = (token, username, userId) => {
    return dispatch => {
        axios.get(api.api_user_status, {
            params: {
                username: username,
                token: token,
                userId: userId
            }
        })
        .then(res => res.data)
        .then(res => {
            if ("inGroups" in res)
            {
                dispatch(updateInfo(res))
            } else {
                dispatch(logout())
            }
        })
        .catch(function (error) {
            dispatch(logout())
        })
    }
}