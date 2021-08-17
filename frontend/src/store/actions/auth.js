import axios from 'axios'
import * as actionTypes from './actionTypes'
import * as api from '../../api'


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    }
}

export const authSuccess = (token, username) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username,
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error,
    }
}

export const logout = () => {
    localStorage.removeItem('token') // xoa session trong local
    localStorage.removeItem('username') // nhu tren
    localStorage.removeItem('expirationDate') // nhu tren

    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

export const checkAuthTimeout = (expirationTime) => { // check session timeout trong local 
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime)
    }
}


export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(api.api_signin, {
            username: username,
            password: password
        }).then((response) => {
            const token = response.data.token
            const expirationDate = new Date(new Date().getTime() + 3600*1000* 24 * 7) 
            localStorage.setItem('token', token) 
            localStorage.setItem('username', username)
            localStorage.setItem('expirationDate', expirationDate)
            dispatch(authFail(response.data.msg))
            dispatch(authSuccess(token, username))
            dispatch(checkAuthTimeout(3600 * 1000* 24 * 7))
        }).catch(error => {
            dispatch(authFail("Loi he thong")) // save error vao bo nho
        })
    }
}

export const authSignup = (username, email, password, repassword) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(api.api_signup, {
            username: username,
            email: email,
            password: password,
            repassword: repassword
        }).then((response) => {
            const token = response.data.token
            const expirationDate = new Date(new Date().getTime() + 3600*1000* 24 * 7)
            localStorage.setItem('token', token) // save item vao bo nho local
            localStorage.setItem('username', username)
            localStorage.setItem('expirationDate', expirationDate)
            dispatch(authFail(response.data.msg))
            dispatch(authSuccess(token, username))
            dispatch(checkAuthTimeout(3600 * 1000* 24 * 7))
        }).catch(error => {
            dispatch(authFail("Loi he thong")) // save error vao bo nho
        })
    }
}


export const authCheckState = () => {
    // moi lan vao web se check lai state tu bo nho local
    return dispatch => {
        const token = localStorage.getItem('token')
        if (token === undefined) {
            dispatch(logout())
        } else {
            const expirationDate = localStorage.getItem('expirationDate')
            if (expirationDate < new Date()) {
                dispatch(logout())
            } else {
                const username = localStorage.getItem('username')
                dispatch(authSuccess(token, username))
                dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()))
            }
        }
    }
}
