import axios from "axios";
import {AUTH_LOGOUT, AUTH_SUCCESS} from "./actionTypes";

export function auth(email, password, isLogin) {
    return async dispatch => {
        const authData = {
            email,
            password,
            returnSecureToken: true
        }

        const key = 'AIzaSyCfqyo15i4ROAisQEgZvlacCUE1Rpkjh1U'
        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`

        if (isLogin) {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`
        }

        const response = await axios.post(url, authData)

        const data = response.data
        const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

        localStorage.setItem('token', data.idToken)
        localStorage.setItem('userId', data.localId)
        localStorage.setItem('expirationDate', expirationDate)
        localStorage.setItem('refreshToken', data.refreshToken)

        dispatch(authSuccess(data.idToken))

        setTimeout(async () => {
            const res = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${key}`,
                `grant_type=refresh_token&refresh_token=${localStorage.getItem('refreshToken')}`)

            const data = res.data
            const expirationDate = new Date(new Date().getTime() + data.expires_in * 1000)

            localStorage.setItem('token', data.id_token)
            localStorage.setItem('refreshToken', data.refresh_token)
            localStorage.setItem('expirationDate', expirationDate)

            dispatch(authSuccess(data.id_token))

        }, expirationDate * 1000)

    }
}

export function authSuccess(token) {
    return {
        type: AUTH_SUCCESS,
        token
    }
}

export function autoLogin() {
    return dispatch => {
        const token = localStorage.getItem('token')

        if (!token) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                dispatch(authSuccess(token))
            }
        }
    }
}

export function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('refreshToken')

    return {
        type: AUTH_LOGOUT
    }
}
