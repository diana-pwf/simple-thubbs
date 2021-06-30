<template>
  <a-list
      class="comment-list"
      item-layout="horizontal"
      :data-source="onshowReplyList"
  >
    <a-list-item slot="renderItem" slot-scope="item, index">

      <a-comment>
        <template v-slot:author>
          <p class="nickname">{{item.nickname}}</p>
        </template>
        <div slot="content" class="reply-content" v-html="item.content"></div>

        <template v-slot:datetime>
          <p class="time">创建于{{ item.created }}， 更新于{{ item.updated }}</p>
        </template>

        <PostAction :replyId="item.id" :postId="item.postId" :isMainPost="0" :postUserId="item.userId" :postContent="item.content"></PostAction>
        <a-collapse v-if="item.commentPosts.length" :bordered="false">
          <a-collapse-panel class="comment-area">
            <template v-slot:header>
              <p class="panelHead">更多回复</p>
            </template>
            <SubReplyList :showTotalList="item.commentPosts"></SubReplyList>
          </a-collapse-panel>
        </a-collapse>
      </a-comment>
    </a-list-item>
  </a-list>
</template>

<script>

import {Component, Prop, Vue} from 'vue-property-decorator';
import PostAction from "@/components/PostAction";
import SubReplyList from "@/components/SubReplyList";

@Component({
  components: {PostAction, SubReplyList}
})

export default class PostView extends Vue {
  @Prop({type:Array, default:function (){return []}})onshowReplyList
}
</script>


<style scoped>
.comment-list {
  width: 800px;
  margin: auto;
}
.comment-area {
  width: 800px;
  background: #f7f7f7;
  border-radius: 4px;
  margin-bottom: 24px;
  border: 0;
  overflow: hidden;
  position: relative;
}
.panelHead {
  position: absolute;
  left: 40px;
  top: 0;
}
.reply-content {
  font-size: 20px;
  text-align: left;
}

.nickname {
  font-size:20px;
}
.time {
  color: black;
}
</style>