<template>
  <a-card class="main">
    <a-avatar class="author" style="color: #f56a00; backgroundColor: #fde3cf" :size="100">
      {{postAuthor}}
    </a-avatar>
    <a-card-meta>
      <template v-slot:title>
        <h2 class="title">{{postTitle}}</h2>
      </template>
    <template v-slot:description>
      <p class="time">创建于{{postCreatedTime}}, 更新于{{postUpdatedTime}}</p>
    </template>
    </a-card-meta>
    <template slot="actions" class="ant-card-actions">
      <PostAction :postId="postId" :isMainPost="1" :postUserId="postUserId" :postTitle="postTitle" :postContent="postContent"></PostAction>
    </template>
    <a-card-meta class="content" :title="postTitle" description="postContent" v-html="postContent"></a-card-meta>
  </a-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import PostAction from '@/components/PostAction.vue';

@Component({
  components: {
    PostAction
  }
})
export default class MainPost extends Vue {
  @Prop({type:String, default:""})postTitle: any
  @Prop({type:String, default:""})postContent: any
  @Prop({type:String, default:""})postAuthor: any
  @Prop({type:String, default:""})postUpdatedTime: any
  @Prop({type:String, default:""})postCreatedTime: any
  @Prop({type:Number, default:0})postId: any
  @Prop({type:Number, default:0})postUserId: any

}

</script>

<style scoped>
.main {
  margin: auto;
  width: 1000px;
  border: none;
  font-size: 20px;
}

.author {
  float:left;
}

.time {
  text-align: left;
  float: top;
}

.title {
}

.content {
  text-align: left;
}
</style>