<template>
  <div id="personalMenu">
    <div id="menu-body">
    <a-menu
        style="width: 256px"
        :default-selected-keys="['1']"
        :default-open-keys="['1']"
        mode="inline"
        :theme="'light'"
        :selected-keys="[current]"
        @click="handleClick"
    >
      <a-menu-item key="1">
        <a-icon type="file-done" />
        我的收藏
      </a-menu-item>
      <a-menu-item key="2">
        <a-icon type="history" />
        我的足迹
      </a-menu-item>
    </a-menu>
      <a-button type="primary" v-on:click="sendClear()">清除当前记录</a-button>
      <PostView class="posts" :onshowPostList="postList"></PostView>
    </div>
  </div>
</template>


<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import PostView from '@/components/Postview.vue';
import axios from "axios";
import {Modal} from "ant-design-vue";

@Component({
  components: {PostView}
})

export default class PersonalMenu extends Vue {
  current = 1
  postList = []
  currentKey = '1';

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
      if (e.response.status === 401)
      {
        Modal.error({"content":"登录状态失效，请重新登录"})
        window.localStorage.logged = false
        window.localStorage.token = ""
        window.localStorage.username = ""
        this.$store.state.logged = false
      }
      else
      {
        Modal.error({"content":"未知错误，请稍后再试"})
      }
    }
  }

  handleClick(e) {
    this.currentKey = e.key
    switch (this.currentKey)
    {
      case "1":
        this.postList = window.localStorage['favorite'] && JSON.parse(window.localStorage['favorite']);
        break;
      case "2":
        this.postList = window.localStorage['history'] && JSON.parse(window.localStorage['history']);
        break;
    }
  }

  sendClear(){
    Modal.confirm({"content":"确定要清除所有记录吗？", "onOk":()=>this.clearAll()})
  }

  clearAll() {
    switch (this.currentKey)
    {
      case "1":
        delete window.localStorage['favorite']
        this.$store.state.favorite = []
        this.postList = []
        window.location.reload()
        break
      case "2":
        delete window.localStorage['history']
        this.$store.state.history = []
        this.postList = []
        window.location.reload()
        break
    }

  }


}
</script>

<style scoped>
#personalMenu {
  width: 1200px;
  margin: 20px auto 20px auto;
}

.switch {
  float: left;

}

#menu-body {
  display: flex;
}

.posts {
  height: 800px;
  overflow: scroll;
}
</style>