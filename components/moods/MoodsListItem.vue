<template>
  <b-alert class="mood-item" :class="{ editing: editing }" variant="dark" show>
    <span class="mood-item-color" :style="colorStyle"></span>

    <div v-if="!editing">
      <a v-if="mood.has_playlist" class="playlist_link" :href="`https://open.spotify.com/playlist/${mood.playlist_id}`">
        <span>{{ mood.name }}</span>
        <fa class="playlist_link__icon" :icon="linkIcon" />
      </a>
      <span v-else>{{ mood.name }}</span>

      <button class="action edit" @click="editMood">
        <fa :icon="editMoodIcon" />
      </button>
    </div>
    <div v-else class="d-flex">
      <b-input
        ref="nameInput"
        v-model="mood.name"
        size="sm"
        placeholder="Mood name..."
        autofocus
        :disabled="busy"
        @keydown.enter="saveMood"
        @keydown.esc="deleteMood"
      />
      <b-input v-model="mood.color" class="mood-color-picker" type="color" size="sm" />

      <button class="action submit" @click="saveMood">
        <fa :icon="submitMoodIcon" />
      </button>
    </div>

    <button class="action close" @click="deleteMood">
      <fa :icon="deleteMoodIcon" />
    </button>
  </b-alert>
</template>

<script>
import Vue from 'vue'
import { faCheck, faExternalLinkAlt, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

export default {
  props: {
    events: {
      type: Vue,
      default: () => null,
    },
    mood: {
      type: Object,
      default: () => ({}),
    },
    editing: Boolean,
    busy: Boolean,
  },
  computed: {
    linkIcon() {
      return faExternalLinkAlt
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
    colorStyle() {
      return {
        background: this.mood?.color || undefined,
      }
    },
  },
  created() {
    if (this.events) {
      this.events.$on('edit-prevented', () => {
        if (this.$refs.nameInput) {
          this.$refs.nameInput.focus()
        }
      })
    }
  },
  methods: {
    editMood() {
      this.$emit('edit', { ...this.mood })
    },

    saveMood() {
      if (!this.mood.name) {
        return
      }
      this.$emit('save', { ...this.mood })
    },

    async deleteMood() {
      if (this.mood.new) {
        this.$emit('delete', { ...this.mood })
        return
      }

      const confirmMsg = this.editing ? 'Revert changes?' : 'Delete mood?'
      const confirmed = await this.$bvModal.msgBoxConfirm(confirmMsg, {
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-1',
      })

      if (confirmed) {
        const eventName = this.editing ? 'revert' : 'delete'
        this.$emit(eventName, { ...this.mood })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
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
      opacity: 0.5 !important;
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

    opacity: 0 !important;
    transition: opacity 0.5s;

    &:focus {
      outline: none;
    }
  }

  .submit,
  .edit {
    right: 2.2rem;
  }
}

.playlist_link {
  span {
    color: #212529;
    font-weight: 500;
  }
}

.playlist_link__icon {
  font-size: 0.7rem;
  margin-left: 5px;
}
</style>
