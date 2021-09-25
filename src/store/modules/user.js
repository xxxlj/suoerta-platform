import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import accountList from '@/utils/account'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      const valid_password = accountList.filter(i => i.name === username)[0].password
      if (valid_password === password) {
        const token = `${username}_token`
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      } else {
        reject('密码错误！')
      }
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const username = state.token.split('_')[0]
      if (username) {
        commit('SET_NAME', username)
        resolve()
      } else {
        reject()
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

