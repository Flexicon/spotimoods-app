<template>
  <b-navbar toggleable="sm" type="dark" variant="dark">
    <b-navbar-brand>Spotimoods</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/about">About</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item>
          <span class="d-flex align-items-center">
            <fa :icon="signOutIcon" class="mr-1" />
            <span>Log out</span>
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
}
</script>
