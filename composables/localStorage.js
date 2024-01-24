import { userStore } from "@/stores/userStore"

export default {
    setToken(token) {
        userStore().setAuth(token)
        window.localStorage.setItem('token', token);
    },
    getToken() {

        return window.localStorage.getItem('token');
    },
    saveUser(user) {
        userStore().setUser(user)
        window.localStorage.setItem('userInfo', JSON.stringify(user));
    },
    getUser() {
        let userString = window.localStorage.getItem('userInfo');
        return userString ? JSON.parse(userString) : {};
    },
    setItem(key, value) {
        window.localStorage.setItem(key, value);
    },
    getItem(key) {
        return window.localStorage.getItem(key)
    },
    logOut() {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('userInfo')
        userStore().setLogOut()
    }
}