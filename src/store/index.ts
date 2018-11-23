import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app.ts'
import user from './modules/user.ts'
import getters from './getters.ts'
import golbal from './modules/golbal.ts'
import permission from './modules/permission.ts'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    golbal,
    permission
  },
  getters
})

export default store
