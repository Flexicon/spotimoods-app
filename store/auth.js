export const state = () => ({
  token: localStorage.getItem('auth.token') || null,
})

export const mutations = {
  setToken: (state, token) => {
    state.token = token
  },
}

export const getters = {
  isLoggedIn: (state) => !!state.token,
}

export const actions = {
  logIn({ commit }, token) {
    localStorage.setItem('auth.token', token)
    this.$axios.setToken(token, 'Bearer')
    commit('setToken', token)
  },

  logOut({ commit }) {
    localStorage.removeItem('auth.token')
    this.$axios.setToken(false)
    commit('setToken', null)
  },
}
