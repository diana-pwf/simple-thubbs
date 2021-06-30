<template>
  <a-list
      class="comment-list"
      item-layout="horizontal"
      :data-source="onshowPostList"
  >
    <a-list-item class="list-item" slot="renderItem" slot-scope="item, index">
      <a-comment v-on:click="toDetail(item)">
        <template v-slot:author>
          <p class="nickname">{{item.nickname}}</p>
          <p>用户编号：{{item.userId}}</p>
        </template>
        <div slot="content" class="post-title" v-html="item.title"></div>
        <p class="post-content">{{item.content}}</p>
          <template v-slot:datetime>
            <p class="time">创建于{{ item.created }}， 更新于{{ item.updated }}</p>
          </template>
      </a-comment>
    </a-list-item>
  </a-list>
</template>

<script>

import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class PostView extends Vue {
  @Prop({type:Array, default:function (){return[]}})onshowPostList

  toDetail(postItem){
    this.$store.state.history = this.$store.state.history.filter(function (obj){
      return obj.id !== postItem.id
    })
    this.$store.state.history.unshift(postItem)
    window.localStorage['history'] = JSON.stringify(this.$store.state.history)
    this.$router.push(`/detail/${postItem.id}`)
  }

}
</script>


<style scoped>
.comment-list {
  max-width: 1200px;
  margin: auto;
}
p {
  max-width: 800px;

}
.post-title {
  font-family: "Microsoft YaHei", "SimHei", "Apple LiGothic Medium", serif;
  font-weight: 900;
  font-size: 20px;
  float: left;
}
.post-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
  float: left;
}
li {
  text-align: center;
}
.nickname {
  font-size:20px;
}
.time {
  color: black;
}
.list-item {
  cursor: pointer;
}
</style>