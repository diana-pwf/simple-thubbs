<template>
  <div>
    <Nav></Nav>
    <PersonalMenu></PersonalMenu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Nav from '@/components/Nav.vue';
import PersonalMenu from '@/components/PersonalMenu.vue';

@Component({
  components: {
    Nav, PersonalMenu
  },
})

export default class Personal extends Vue {

}
</script>


<style scoped>

</style>