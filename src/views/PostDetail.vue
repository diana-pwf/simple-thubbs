<template>
  <div>
    <Nav>
      <template v-slot:option>
        <a-button key="2" v-on:click="toPersonal()">个人中心</a-button>
      </template>
    </Nav>
    <a-button class="button" v-on:click="LZStateChange()">{{LZbuttonName}}</a-button>
    <a-button class="button" v-on:click="favoriteStateChange()">{{likebuttonName}}</a-button>
    <MainPost :postTitle="postTitle" :postContent="postContent" :postAuthor="postAuthor" :postId="postId" :postUserId="postUserId" :postUpdatedTime="postUpdatedTime" :postCreatedTime="postCreatedTime"></MainPost>

    <a-divider>回帖列表</a-divider>

    <ReplyList :onshowReplyList="onshowReplyList"></ReplyList>
    <Pagination></Pagination>
  </div>

</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue, Watch } from 'vue-property-decorator';
import Nav from '@/components/Nav.vue';
import Pagination from "@/components/Pagination.vue";
import MainPost from "@/components/MainPost.vue";
import ReplyList from "@/components/ReplyList.vue";
import {Modal} from "ant-design-vue";


@Component({
  components: {
    Nav, Pagination, MainPost, ReplyList
  },
})

export default class PostDetail extends Vue {
  post = undefined
  postTitle = ""
  postContent = ""
  postUpdatedTime = ""
  postCreatedTime = ""
  postAuthor = ""
  postId = 0
  postUserId = 0
  onlyLZ = false
  like = null
  LZbuttonName = "只看楼主"
  likebuttonName = ""

  replyList = []
  mainPostReplyList:any[] = []
  replyTree:any[] = []
  onshowReplyList:any[] = []

  @Watch("$store.state.currPage")func1(){
    this.getPostDetail()
  }
  @Watch("$store.state.pageSize")func2(){
    this.getPostDetail()
  }
  @Watch("$store.state.searchUserId")func3(){
    this.getPostDetail()
  }
  @Watch("onlyLZ")func4(){
    this.getPostDetail()
  }

  getLikebuttonName(){
    this.like = window.localStorage['favorite'] && JSON.parse(window.localStorage['favorite']).some((obj) => {return obj.id === this.postId})

    if(this.like) {
      this.likebuttonName = "取消收藏"
    }
    else{
      this.likebuttonName = "收藏"
    }
  }

  LZStateChange() {
    this.onlyLZ = !this.onlyLZ
    if (this.onlyLZ)
    {
      this.LZbuttonName = "取消只看楼主"
    }
    else
    {
      this.LZbuttonName = "只看楼主"
    }
  }

  favoriteStateChange(){
    this.like = !this.like
    if (this.like)
    {
      this.likebuttonName = "取消收藏"
      this.$store.state.favorite.unshift(this.post)
      window.localStorage['favorite'] = JSON.stringify(this.$store.state.favorite)
    }
    else
    {
      this.likebuttonName = "收藏"
      this.$store.state.favorite = this.$store.state.favorite.filter((obj) => {
        return obj.id !== this.postId
      })
      window.localStorage['favorite'] = JSON.stringify(this.$store.state.favorite)
    }

  }

  async getPostDetail() {
    axios.defaults.headers.common["Authorization"] = window.localStorage.token
    try{
      let response = await axios.get(`/api/v1/post/${this.$route.params.postId}`, {})
      if (response.status === 200) {
        this.post = response.data
        this.postTitle = response.data.title
        this.postContent = response.data.content
        this.postUpdatedTime = response.data.updated
        this.postCreatedTime = response.data.created
        this.postAuthor = response.data.nickname
        this.postId = response.data.id
        this.postUserId = response.data.userId

        // 回复列表获取与处理
        this.replyList = response.data.reply

        // 初始化后重新push
        this.replyTree = []
        for (let reply of this.replyList)
        {
          if (reply["replyId"] === 0)
          {
            let postReply: any[] = []
            postReply[0] = reply
            this.replyTree.push(postReply)
          }
          else
          {
            for (let postReply of this.replyTree)
            {
              for (let num of postReply)
              {
                if (reply["replyId"] === num["id"])
                {
                  postReply.push(reply)
                }
              }
            }
          }
        }

        this.mainPostReplyList = []
        for (let reply of this.replyTree)
        {
          if (this.onlyLZ)
          {
            if(reply[0].userId === this.postUserId)
            {
              reply[0].commentPosts = reply.slice(1)
              for (let tmp of reply.slice(1))
              {
                tmp.replyNickname = reply.find(function(x: { id: any; }){return x.id == tmp.replyId;}).nickname
              }
              this.mainPostReplyList.push(reply[0])
            }
          }
          else
          {
            reply[0].commentPosts = reply.slice(1)
            for (let tmp of reply.slice(1))
            {
              tmp.replyNickname = reply.find(function(x: { id: any; }){return x.id == tmp.replyId;}).nickname
            }
            this.mainPostReplyList.push(reply[0])
          }
        }


        // 更新要显示的list
        let num = this.$store.state.currPage
        let len = this.$store.state.pageSize
        this.$store.state.postTotal = this.mainPostReplyList.length
        if (num * len <= this.mainPostReplyList.length)
        {
          this.onshowReplyList = this.mainPostReplyList.slice(len*(num - 1), len*num)
        }
        else
        {
          this.onshowReplyList = this.mainPostReplyList.slice(len*(num - 1))
        }
      }
    }
    catch (e) {
      Modal.error({"content":"登录状态失效，请重新登录！", "onOk":()=>{this.$router.push('/')}})
      window.localStorage.logged = false
      window.localStorage.token = ""
      window.localStorage.username = ""
      this.$store.state.logged = false
    }

  }

  toPersonal() {
    this.$router.push('/personal')
  }

  async created() {
    await this.getPostDetail()
    this.getLikebuttonName()
  }

}
</script>

<style scoped>
.button {
  margin: 30px;
}

h3 {
  margin: 20px;

}

</style>