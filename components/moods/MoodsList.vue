<template>
  <div class="moods">
    <h3 class="mb-3">
      <span>Moods</span>
      <a href="#" role="button" @click.prevent="addMood">
        <fa :icon="addMoodIcon" />
      </a>
    </h3>

    <b-spinner v-if="busy && moods === null" />

    <div v-else-if="moods && (moods.length || newMood)" class="moods-list">
      <MoodsListItem
        v-for="mood in moods"
        :key="mood.id"
        :mood="mood.id === editedMoodID ? editedMood : mood"
        :editing="mood.id === editedMoodID"
        :busy="busy"
        @save="saveMood"
        @delete="deleteMood"
        @edit="editMood"
        @revert="revertMood"
      />

      <MoodsListItem v-if="newMood" :mood="newMood" :busy="busy" editing @save="saveMood" @delete="deleteMood" />
    </div>

    <em v-else class="text-muted">
      Go on then, add a mood!
    </em>
  </div>
</template>

<script>
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
      newMood: null,
      editedMood: null,
    }
  },
  computed: {
    editedMoodID() {
      return this.editedMood?.id
    },
    addMoodIcon() {
      return faPlusSquare
    },
  },
  methods: {
    addMood() {
      if (this.newMood) {
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
      this.editedMood = { ...mood }
    },

    revertMood() {
      this.editedMood = null
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
</style>
