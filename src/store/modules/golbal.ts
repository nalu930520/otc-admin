import { queryCurrency } from '@/api/golbal'
const golbal = {
  state: {
    fiat_list: [],
    crypto_list: [],
    currency: []
  },

  mutations: {
    SET_FIATLIST: (state, fiatList) => {
      state.fiat_list = fiatList
    },
    SET_CRYPTOLIST: (state, cryptoList) => {
      state.crypto_list = cryptoList
    },
    SET_CURRENCY: (state, currency) => {
      state.currency = currency
    }
  },
  actions: {
    // 获取用户登录信息
    GetCurrency ({ commit }) {
      return new Promise((resolve, reject) => {
        queryCurrency().then(response => {
          if (response.ret === 1) {
            console.log('currency:',response)
            commit('SET_CURRENCY', response.currencies)
            resolve(response.currencies)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default golbal
