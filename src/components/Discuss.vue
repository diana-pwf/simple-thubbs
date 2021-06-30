<template>
  <div>
    <Nav>
      <template v-slot:option>
        <a-button key="2" v-on:click="toPersonal()">个人中心</a-button>
      </template>
    </Nav>
    <h1>清软论坛</h1>
    <Search></Search>
    <Postview :onshowPostList="postList"></Postview>
    <Pagination></Pagination>
  </div>
</template>

<script>
import {Component, Vue, Watch} from 'vue-property-decorator';
import Nav from '@/components/Nav.vue';
import Search from "@/components/Search.vue";
import Postview from "@/components/Postview.vue";
import Pagination from "@/components/Pagination.vue";
import axios from "axios";
import {Modal} from "ant-design-vue";

@Component({
  components: {
    Nav, Search, Postview, Pagination
  },
})

export default class Discuss extends Vue {
  postList = []

  @Watch("$store.state.currPage")func1(){
    this.getToShowPosts()
  }
  @Watch("$store.state.pageSize")func2(){
    this.getToShowPosts()
  }
  @Watch("$store.state.searchUserId")func3(){
    this.getToShowPosts()
  }


  toPersonal() {
    this.$router.push('/personal')
  }

  async getToShowPosts() {
    axios.defaults.headers.common["Authorization"] = window.localStorage.token
    try {
      let response = await axios.get('/api/v1/post', {params:{
          'page': this.$store.state.currPage,
          'size': this.$store.state.pageSize,
          'userId': this.$store.state.searchUserId,
          // 最近更新
        }})
      if (response.status === 200) {
        this.postList = response.data.posts
        this.$store.state.postTotal = response.data.total
      }
    }
    catch (e) {
      if (e.response.status === 401) {
        Modal.error({"content": "登录状态失效，请重新登录"})
        window.localStorage.logged = false
        window.localStorage.token = ""
        window.localStorage.username = ""
        this.$store.state.logged = false
      }
      else
      {
        Modal.error({"content": "未知错误，请稍后再试"})
      }
    }
  }

  mounted() {
    this.getToShowPosts()
  }

}
</script>


<style scoped>

</style>