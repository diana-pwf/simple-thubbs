<template>
  <div class="home">
    <Login v-if="!logged"></Login>
    <Discuss v-if="logged"></Discuss>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from "@/components/Login.vue"; // @ is an alias to /src
import Discuss from '@/components/Discuss.vue';

@Component({
  components: {
    Login,
    Discuss,
  }
})

export default class Home extends Vue {
  get logged() {
    return this.$store.state.logged
  }

  mounted() {

  }

}
</script>
