<template>
  <div>
  <a-list
      class="comment-list"
      item-layout="horizontal"
      :data-source="showList"
  >
    <a-list-item slot="renderItem" slot-scope="subitem, index">
      <a-comment class="comment">
        <template class="nickname" v-slot:author>
          <p class="nickname">{{subitem.nickname}}</p>
          <p>用户编号：{{subitem.userId}}</p>
        </template>
        <p class="replyTo">Reply to {{subitem.replyNickname}}</p>
        <p slot="content" class="post-content" v-html="subitem.content"></p>
          <template v-slot:datetime>
          <p class="time">创建于{{ subitem.created }}, 更新于{{ subitem.updated }}</p>
          </template>
        <PostAction :replyId="subitem.id" :postId="subitem.postId" :isMainPost="0" :postUserId="subitem.userId" :postContent="subitem.content"></PostAction>

      </a-comment>
    </a-list-item>
  </a-list>
    <a-pagination
        show-quick-jumper
        :page-size-options="pageSizeOptions"
        :total="showTotalList.length"
        show-size-changer
        :page-size="pageSize"
        @change="onChange"
        @showSizeChange="onShowSizeChange"
    />
  </div>
</template>

<script>
import {Component, Vue, Prop} from 'vue-property-decorator';
import PostAction from "@/components/PostAction.vue";

@Component({
  components:{PostAction}
})
export default class SubReplyList extends Vue {
  @Prop({type:Array, default:function (){return[]}})showTotalList

  pageSizeOptions = ['3', '5', '10']
  pageSize = 3
  currPage = 1
  showList = []

  onShowSizeChange(current, pageSize) {
    this.pageSize = pageSize
    this.updateShowList()
  }

  onChange(page, pageSize)
  {
    this.currPage = page
    this.updateShowList()
  }

  updateShowList()
  {
    let num = this.currPage
    let len = this.pageSize
    if (num * len <= this.showTotalList.length)
    {
      this.showList = this.showTotalList.slice(len*(num - 1), len*num)
    }
    else
    {
      this.showList = this.showTotalList.slice(len*(num - 1))
    }
  }

  mounted(){
    this.updateShowList()
  }

}
</script>

<style scoped>
.comment {
  position: relative;
}
.nickname {
  font-size: 20px;
}
.replyTo {
  position: absolute;
  right: 100px;
  bottom: 40px;
}
.post-content {
  font-size: 20px;
  text-align: left;
}
.time {
  color: black;
}
</style>