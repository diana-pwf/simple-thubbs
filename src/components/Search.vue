<template>
  <div>
    <a-input-search class="search" placeholder="input search userid" enter-button @search="onSearch" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Search extends Vue {
  $store: any;
  onSearch(value: number) {
      this.$store.state.searchUserId = value
  }
}
</script>

<style scoped>
.search {
  width: 600px;
}
</style>