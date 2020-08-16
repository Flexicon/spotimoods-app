export default function ({ $axios, store, redirect }) {
  $axios.setToken(store.state.auth.token, 'Bearer')

  $axios.onError(async (error) => {
    if (error.response.status === 401) {
      await store.dispatch('auth/logOut')
      redirect({ name: 'login', query: { expired: true } })
    }
  })
}
