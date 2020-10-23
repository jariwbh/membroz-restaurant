//-------User authtoken--------//
export const SECRET_KEY = 'authuser'
export const SECRET_KEY_REMEMBER_USER = 'rememberuser'
export const SECRET_KEY_UNSAVED_LOCAL_ORDERS = 'unsavedorders'

export const isAuthenticated = () => (localStorage.getItem(SECRET_KEY) !== null)
export const authenticateUser = user => localStorage.setItem(SECRET_KEY, user)
export const destroySession = () => {
   localStorage.removeItem(SECRET_KEY)
   localStorage.removeItem(SECRET_KEY_UNSAVED_LOCAL_ORDERS)
}

export const getUser = () => {
   return JSON.parse(localStorage.getItem(SECRET_KEY));
}
export const getToken = () => {
   const user = getUser() //JSON.parse(localStorage.getItem(SECRET_KEY));
   return user.token
}
export const getUserId = () => {
   const user = getUser() //JSON.parse(localStorage.getItem(SECRET_KEY));
   return user.user._id
}

export const getRememberUser = () => {
   return JSON.parse(localStorage.getItem(SECRET_KEY_REMEMBER_USER));
}
export const setRememberUser = (oUsername, oPassword, oRememberMe) => {
   if (oRememberMe) {
      const user = { username: oUsername, password: oPassword };
      localStorage.setItem(SECRET_KEY_REMEMBER_USER, JSON.stringify(user))
   } else {
      removeRememberUser();
   }
}

export const removeRememberUser = () => localStorage.removeItem(SECRET_KEY_REMEMBER_USER)

