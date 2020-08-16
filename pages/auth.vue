<template>
  <div class="mt-5 text-center">
    <b-spinner style="width: 3rem; height: 3rem;" />
  </div>
</template>

<script>
export default {
  async created() {
    const { token } = this.$route.query
    const nextRoute = { name: 'index' }

    if (token) {
      await this.$store.dispatch('auth/logIn', token)
      nextRoute.query = { authed: true }
    }

    this.$router.push(nextRoute)
  },
}
</script>
