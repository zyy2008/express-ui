import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserIDKey = 'useId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getUserId() {
  return Cookies.get(UserIDKey)
}

export function setUserId(id) {
  return Cookies.set(UserIDKey, id)
}

export function removeUserId() {
  return Cookies.remove(UserIDKey)
}
