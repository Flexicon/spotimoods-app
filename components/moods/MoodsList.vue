<template>
  <div class="moods">
    <h3 class="mb-3">
      <span>Moods</span>
      <a class="add-mood" href="#" role="button" :disabled="isUserEditing" @click.prevent="addMood">
        <fa :icon="addMoodIcon" />
      </a>
    </h3>

    <b-spinner v-if="busy && moods === null" />

    <div v-else-if="moods && (moods.length || newMood)" class="moods-list">
      <MoodsListItem
        v-for="mood in moods"
        :key="mood.id"
        :mood="mood.id === editedMoodID ? editedMood : mood"
        :initial-values="mood"
        :editing="mood.id === editedMoodID"
        :busy="busy"
        :events="itemEvents"
        @save="saveMood"
        @delete="deleteMood"
        @edit="editMood"
        @revert="revertMood"
      />

      <MoodsListItem
        v-if="newMood"
        :mood="newMood"
        :busy="busy"
        :events="itemEvents"
        editing
        @save="saveMood"
        @delete="deleteMood"
      />
    </div>

    <em v-else class="text-muted">
      Go on then, add a mood!
    </em>
  </div>
</template>

<script>
import Vue from 'vue'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

export default {
  props: {
    moods: {
      type: Array,
      default: () => null,
    },
    busy: Boolean,
  },
  data() {
    return {
      itemEvents: new Vue(),
      newMood: null,
      editedMood: null,
    }
  },
  computed: {
    editedMoodID() {
      return this.editedMood?.id
    },
    isUserEditing() {
      return Boolean(this.newMood || this.editedMood)
    },
    addMoodIcon() {
      return faPlusSquare
    },
  },
  methods: {
    addMood() {
      if (this.isUserEditing) {
        this.itemEvents.$emit('edit-prevented')
        return
      }

      this.newMood = {
        name: '',
        color: '#cccccc',
        new: true,
      }
    },

    saveMood(mood) {
      if (!mood.name) {
        return
      }
      this.$emit('save', mood)
      this.newMood = null

      if (this.editedMoodID === mood.id) {
        this.editedMood = null
      }
    },

    deleteMood(mood) {
      if (mood.new) {
        this.newMood = null
        return
      }
      this.$emit('delete', mood)
    },

    editMood(mood) {
      if (this.isUserEditing) {
        this.itemEvents.$emit('edit-prevented')
        return
      }

      this.editedMood = { ...mood }
    },

    revertMood() {
      this.editedMood = null
    },
  },
}
</script>

<style lang="scss" scoped>
.add-mood {
  &[disabled] {
    color: grey;
  }
}

.moods-list {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 1rem;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
