<template>
  <div class="artists">
    <h3 class="mb-3">Artists</h3>

    <div v-if="artists" class="artists-list">
      <ArtistsListItem v-for="artist in artists" :key="artist.id" :artist="artist" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artists: {
      type: Array,
      default: () => null,
    },
  },
}
</script>

<style lang="scss" scoped>
.artists-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
</style>
