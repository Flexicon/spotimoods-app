<template>
  <div class="pt-3">
    <div class="moods">
      <h3 class="mb-3">
        <span>Moods</span>
        <a href="#" role="button" @click.prevent="addMood">
          <fa :icon="addMoodIcon" />
        </a>
      </h3>

      <b-spinner v-if="loadingMoods && moods === null" />
      <div v-else-if="moods && moods.length" class="moods-list">
        <b-alert
          v-for="mood in moods"
          :key="mood.id"
          class="mood-item"
          :class="{ editing: editedID == mood.id }"
          variant="dark"
          show
        >
          <span class="mood-item-color" :style="getMoodColorStyle(mood)"></span>

          <span v-if="editedID != mood.id">{{ mood.name }}</span>
          <span v-else style="display: flex;">
            <b-input
              v-model="mood.name"
              size="sm"
              placeholder="Mood name..."
              autofocus
              :disabled="loadingMoods"
              @keydown.enter="saveMood(mood)"
              @keydown.esc="deleteMood(mood)"
            />
            <b-input
              v-model="mood.color"
              class="mood-color-picker"
              type="color"
              size="sm"
            />
          </span>

          <button class="close" @click="deleteMood(mood)">
            <fa :icon="deleteMoodIcon" />
          </button>
        </b-alert>
      </div>

      <em v-else class="text-muted">
        no moods yet
      </em>
    </div>

    <hr class="my-5" />

    <div>
      <h3 class="mb-3">Artists</h3>

      <em class="text-muted">artists will go here...</em>
    </div>
  </div>
</template>

<script>
import { faPlusSquare, faTimes } from '@fortawesome/free-solid-svg-icons'

export default {
  middleware: 'authenticated',
  data() {
    return {
      moods: null,
      loadingMoods: false,
      editedMood: null,
    }
  },
  computed: {
    editedID() {
      return this.editedMood?.id
    },
    addMoodIcon() {
      return faPlusSquare
    },
    deleteMoodIcon() {
      return faTimes
    },
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

    addMood() {
      if (this.editedMood?.new) {
        return
      }

      const newMood = {
        id: `local-${this.moods.length + 1}`,
        name: '',
        color: '#cccccc',
        new: true,
      }
      this.moods.push(newMood)
      this.editedMood = newMood
    },

    async saveMood(mood) {
      if (!mood.name) {
        return
      }

      if (mood.new) {
        const { name, color } = mood

        await this.$axios.$post(`/api/moods`, { name, color })
        this.deleteMood(mood)
        this.fetchMoods()
      }
    },

    async deleteMood(mood) {
      if (mood.new) {
        this.moods = this.moods.filter((m) => m.id !== mood.id)
        this.editedMood = null
        return
      }

      const confirmMsg =
        this.editedID === mood.id ? 'Revert changes?' : 'Delete mood?'
      const confirmed = await this.$bvModal.msgBoxConfirm(confirmMsg, {
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-1',
      })

      if (confirmed) {
        await this.$axios.$delete(`/api/moods/${mood.id}`)
        this.fetchMoods()
      }
    },

    getMoodColorStyle(mood) {
      return {
        background: mood.color || undefined,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.moods-list {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 1rem;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

.mood-item {
  padding-right: 4rem;
  padding-top: 1rem;

  &.editing {
    padding: 0.8rem 3.25rem 0 0.5rem;
  }

  .mood-item-color {
    display: block;
    height: 0.75rem;
    width: calc(100% + 2px);
    background: white;
    position: absolute;
    top: -1px;
    left: -1px;
    border-radius: inherit;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom: 1px solid #c6c8ca;
  }

  .mood-color-picker {
    width: 2.2rem;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1.25rem;
    font-size: 1rem;
    color: inherit;
  }
}
</style>
