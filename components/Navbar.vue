<template>
  <b-navbar toggleable="sm" type="dark" variant="dark">
    <b-navbar-brand>Spotimoods</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav></b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item @click.prevent="signOut">
          <span class="d-flex align-items-center">
            <fa :icon="signOutIcon" class="mr-1" />
            <span>Sign out</span>
          </span>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

export default {
  computed: {
    signOutIcon() {
      return faSignOutAlt
    },
  },
  methods: {
    async signOut() {
      await this.$store.dispatch('auth/logOut')
      this.$router.push({ name: 'login' })
    },
  },
}
</script>
