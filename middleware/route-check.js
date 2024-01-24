import { userStore } from "@/stores/userStore"
var user = userStore()

export default defineNuxtRouteMiddleware((to, from) => {
  var aa=user.getAuth
  var bb=user.getUser
  // debugger
  if (process.client) {

      user.setAuth(localStorage.getToken())
      user.setUser(localStorage.getUser())

      // var aa = user.getAuth
      // var dd = user.getIsAdmin
      // debugger
      if (to.meta.layout == "account" && !user.getAuth) {
        user.setLogOut()
        return navigateTo('/')
      }
      if (to.meta.layout == "dashboard" && !user.getIsAdmin)
        return navigateTo('/')

  }

  // return navigateTo('/')
  // return abortNavigation()
})