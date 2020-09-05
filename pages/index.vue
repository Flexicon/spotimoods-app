<template>
  <div class="pt-3">
    <MoodsList :moods="moods" :busy="loadingMoods" @save="saveMood" @delete="deleteMood" />

    <hr class="my-5" />

    <div>
      <h3 class="mb-3">Artists</h3>

      <em class="text-muted">artists will go here...</em>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {
      moods: null,
      loadingMoods: false,
    }
  },
  created() {
    this.fetchMoods()

    if (this.$route.query.authed) {
      this.$bvToast.toast('Signed in', {
        title: 'Great success! 🎉',
        variant: 'success',
      })
      this.$router.push({})
    }
  },
  methods: {
    async fetchMoods() {
      this.loadingMoods = true
      this.moods = await this.$axios.$get('/api/moods')
      this.loadingMoods = false
    },

    async saveMood(mood) {
      const { id, name, color } = mood
      const payload = { name, color }

      if (mood.new) {
        await this.$axios.$post(`/api/moods`, payload)
      } else {
        await this.$axios.$put(`/api/moods/${id}`, payload)
      }
      this.fetchMoods()
    },

    async deleteMood(mood) {
      await this.$axios.$delete(`/api/moods/${mood.id}`)
      this.fetchMoods()
    },
  },
}
</script>
