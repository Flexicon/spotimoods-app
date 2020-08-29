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

          <div v-if="editedID != mood.id">
            <a
              v-if="mood.has_playlist"
              class="playlist_link"
              :href="`https://open.spotify.com/playlist/${mood.playlist_id}`"
            >
              <span>{{ mood.name }}</span>
              <fa class="playlist_link__icon" :icon="linkIcon" />
            </a>
            <span v-else>{{ mood.name }}</span>

            <button class="action edit">
              <fa :icon="editMoodIcon" />
            </button>
          </div>
          <div v-else class="d-flex">
            <b-input
              v-model="mood.name"
              size="sm"
              placeholder="Mood name..."
              autofocus
              :disabled="loadingMoods"
              @keydown.enter="saveMood(mood)"
              @keydown.esc="deleteMood(mood)"
            />
            <b-input v-model="mood.color" class="mood-color-picker" type="color" size="sm" />

            <button class="action submit" @click="saveMood(mood)">
              <fa :icon="submitMoodIcon" />
            </button>
          </div>

          <button class="action close" @click="deleteMood(mood)">
            <fa :icon="deleteMoodIcon" />
          </button>
        </b-alert>
      </div>

      <em v-else class="text-muted">
        Go on then, add a mood!
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
import { faCheck, faExternalLinkAlt, faPencilAlt, faPlusSquare, faTimes } from '@fortawesome/free-solid-svg-icons'

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
    linkIcon() {
      return faExternalLinkAlt
    },
    addMoodIcon() {
      return faPlusSquare
    },
    deleteMoodIcon() {
      return faTimes
    },
    submitMoodIcon() {
      return faCheck
    },
    editMoodIcon() {
      return faPencilAlt
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

      const confirmMsg = this.editedID === mood.id ? 'Revert changes?' : 'Delete mood?'
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
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.mood-item {
  padding-right: 4rem;
  padding-top: 1rem;
  min-height: 100px;

  &.editing {
    padding: 1rem 4.5rem 0.3rem 0.5rem;
  }

  &:hover,
  &.editing {
    .action {
      opacity: 0.5;
    }
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

  .action {
    position: absolute;
    top: 0;
    right: 0.5rem;
    color: inherit;
    background-color: transparent;
    border: 0;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1;
    text-shadow: 0 1px 0 #fff;
    padding: 1.35rem 0.5rem 1rem;

    opacity: 0;
    transition: opacity 0.5s;
  }

  .submit,
  .edit {
    right: 2.2rem;
  }
}

.playlist_link {
  span {
    color: black;
  }
}

.playlist_link__icon {
  font-size: 0.7rem;
  margin-left: 5px;
}
</style>
