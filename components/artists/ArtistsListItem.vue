<template>
  <div class="artists-list-item" :style="artistImageStyle">
    <span>{{ artist.name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    artist: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    artistImageStyle() {
      const url = this.artist?.images[0]?.url
      if (!url) return null

      return {
        'background-image': `url(${url})`,
        'background-size': 'cover',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.artists-list-item {
  min-height: 150px;
  color: whitesmoke;
  padding: 1rem;

  @media screen and (min-width: 992px) {
    min-height: 250px;
  }
}
</style>
