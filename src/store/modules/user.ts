import Vue from 'vue'
import { login, fetchOauthUrl, fetchUserPermission } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 获取用户登录信息
    GetUserInfo ({ commit }, oauthCode) {
      return new Promise((resolve, reject) => {
        fetchOauthUrl(oauthCode).then(response => {
          console.log('oauthCode:',response)
          commit('SET_ROLES', response.data.rolename)
          commit('SET_NAME', response.data.user_email)
          commit('SET_PERMISSIONS', response.data.permissions)
          setToken(response.data.token)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户权限信息
    GetUserPermissonInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        fetchUserPermission().then(response => {
          commit('SET_ROLES', response.data.rolename)
          commit('SET_NAME', response.data.email)
          commit('SET_PERMISSIONS', response.data.permissions)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登录
    Login ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        console.log('LoginInfo:', userInfo)
        login(userInfo).then(response => {
          if (response.ret === 'ok') {
            const data = response.data
            setToken(data.token)
            commit('SET_TOKEN', data.token)
            resolve(response.ret)
          } else {
            reject(response.ret)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut ({ commit, state }) {
      // return new Promise((resolve, reject) => {
      //   logout().then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      // })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
