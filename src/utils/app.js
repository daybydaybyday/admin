import Cookie from 'cookie_js'

const adminToKen = 'admin_toKen'

const usernameKey = 'username'

export function getToken(){
    return Cookie.get(adminToKen)
}

export function setToken(toKen){
    return Cookie.set(adminToKen,toKen)
}

export function removeToken(){
    return Cookie.remove(adminToKen)
}

export function setUserName(value){
    return Cookie.set(usernameKey,value)
}

export function getUserName(){
    return Cookie.get(usernameKey)
}

export function removeUserName(){
    return Cookie.remove(usernameKey)
}