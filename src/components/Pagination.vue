<template>
  <div>
    <a-pagination
        show-quick-jumper
        :page-size-options="pageSizeOptions"
        :total="postTotal"
        show-size-changer
        :page-size="pageSize"
        @change="onChange"
        @showSizeChange="onShowSizeChange"
    />
    <br />
  </div>
</template>


<script>
import {Component, Vue} from "vue-property-decorator";

@Component
export default class PostView extends Vue {
  pageSizeOptions = ['5', '10', '20', '30', '40', '50']
  onShowSizeChange(current, pageSize) {
    this.$store.state.pageSize = pageSize;
  }
  onChange(page, pageSize)
  {
    this.$store.state.currPage = page;
  }

  get pageSize() {
    return this.$store.state.pageSize
  }
  get currPage() {
    return this.$store.state.currPage
  }
  get postTotal() {
    return this.$store.state.postTotal;
  }

}
</script>

<style scoped>

</style>