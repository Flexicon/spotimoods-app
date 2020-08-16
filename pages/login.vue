<template>
  <b-container class="mt-4">
    <b-jumbotron
      class="text-center m-auto"
      bg-variant="dark"
      text-variant="white"
      border-variant="dark"
      header-level="5"
    >
      <template v-slot:header>Spotimoods</template>

      <template v-slot:lead>
        Compose playlists of your favorite music based on time, weather and -
        most importantly - your mood.
      </template>

      <p class="lead mt-5">
        <a class="btn btn-success btn-lg" href="/api/login" role="button">
          <span>Sign in with Spotify</span>
          <fa :icon="spotifyIcon" />
        </a>
      </p>
    </b-jumbotron>
  </b-container>
</template>

<script>
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

export default {
  layout: 'standalone',
  middleware: ({ store, redirect }) => {
    if (store.getters['auth/isLoggedIn']) {
      return redirect({ name: 'index' })
    }
  },
  computed: {
    spotifyIcon() {
      return faSpotify
    },
  },
}
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .jumbotron {
    width: 50%;
  }
}
</style>
