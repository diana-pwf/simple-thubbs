<template>
  <a-collapse class="main" :bordered="false">
    <template #expandIcon="props">
      <a-icon type="edit"/>
    </template>
    <a-collapse-panel :style="'background: #f7f7f7;border-radius: 4px;border: 0;overflow: hidden'">
      <template v-slot:header>
        <div class="option">
        <a-button class="button-1" :disabled="disability" v-on:click="editPost()">编辑</a-button>
        <a-divider type="vertical" />
        <a-button class="button-1" v-on:click="replyPost()">回复</a-button>
        </div>
      </template>
      <div>
      <a-input v-model="value" v-if="isMainPost && edit && !reply" :defaultValue="postTitle"/>
      <quill-editor v-model="content" :content="defaultContent" :options="editorOption"></quill-editor>
        <div class="option-2">
        <a-upload
            name="file"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            @change="handleChange"
        >
          <a-button class="button-2"> <a-icon type="upload" />点击此处上传长图</a-button>
        </a-upload>
        <a-divider type="vertical" />
      <a-button class="button-2" v-on:click="preSend()">发送</a-button>
        <a-divider type="vertical" />
      <a-button class="button-2" v-on:click="remove()">清除</a-button>
        </div>
        <VEmoji @event="addEmoji"></VEmoji>
      </div>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import axios, { AxiosRequestConfig } from "axios";
import {Modal} from 'ant-design-vue';
import hljs from 'highlight.js';
import VEmoji from "@/components/VEmoji.vue";
import bCrop from 'b-crop'

@Component({
  components:{
    VEmoji
  }
})

export default class PostAction extends Vue {
  @Prop({type:Number, default:function (){return 0}})postId
  @Prop({type:Number, default:function (){return 0}})replyId
  @Prop({type:Number, default:function (){return 0}})isMainPost
  @Prop({type:Number, default:function (){return 0}})postUserId
  @Prop({type:String, default:function (){return ""}})postTitle
  @Prop({type:String, default:function (){return ""}})postContent

  value = ""
  @Watch("postTitle")yyy(){
    this.value = this.postTitle
  }
  content = ""
  edit = 0
  reply = 0

  editorOption = {
    placeholder: "请输入回复",

    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['formula'],
        ['clean'],
        ['link', 'image', 'video'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }]
      ],
      syntax: {
        highlight: text => {return hljs.highlightAuto(text).value}
      },
    }
  }

  get disability(){
    return this.postUserId !== Number(window.localStorage.userId)
  }

  get defaultContent(){
    if(this.edit && !this.reply)
    {
      return this.postContent
    }
    else
    {
      return ""
    }
  }

  preSend()
  {
    Modal.confirm({"content":"确定发送吗？", "onOk":()=>this.send()})
  }

  editPost() {
    this.edit = 1;
    this.reply = 0;
  }

  replyPost() {
    this.edit = 0;
    this.reply = 1;
  }

  file = null
  handleChange(info) {
    if (info.file.status === 'done') {
      this.file = info.file.originFileObj
    }
    else {
    }
  }
  convertBase64UrlToBlob(urlData,type){/*将base64转换成可用formdata提交的文件,urlData base64的url,type 0图片 1视频 */
    let bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : type === 0?'image/png':'image/mp4'});
  }
  async sendFile(){
    let FormData = require('form-data');
    let data = new FormData();

    let name = Date.now().toString()
    data.append('key', name+".png");
    data.append('file', this.file);
    console.log(data)

    let config = {
      method: 'post',
      url: 'https://imagebed-1257647046.cos.ap-nanjing.myqcloud.com',
      headers: {
        "Content-Type": "multipart/formdata"
      },
      data : data
    };
    let bigUrl
    let picUrl
    let respnse = await axios(config)
    if (respnse.status === 204 || respnse.status === 200)
    {
      picUrl = `${config.url}/${name}.png`
    }

    let cutted = await bCrop(this.file, [600, 400])
    if (cutted){
      let data = new FormData();
      data.append('key', name + "-small.png");
      data.append('file', this.convertBase64UrlToBlob(cutted, 0));
      config.data = data
      let respnse = await axios(config)
      if (respnse.status === 204 || respnse.status === 200)
      {
        bigUrl = picUrl
        picUrl = `${config.url}/${name}-small.png"`
      }
    }
    this.content = this.content + `<a href="${bigUrl}"><img src="${picUrl}" /></a>`
  }

  async send() {
    if (this.file !== null)
    {
      await this.sendFile()
    }
    axios.defaults.headers.common["Authorization"] = window.localStorage.token
    if (this.reply && !this.edit) {
      if (this.isMainPost) {
        try{
          let response = await axios.post(`/api/v1/post/${this.postId}/reply`, {
            "content": this.content
          })
          if (response.status === 200) {
            Modal.success({"content":"回复主帖成功, 请刷新后查看"})
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
      else {
        try {
          let response = await axios.post(`/api/v1/post/${this.postId}/reply`, {
            "content": this.content,
            "replyId": this.replyId
          })
          if (response.status === 200) {
            Modal.success({"content": "回复评论成功, 请刷新后查看"})
          }
        } catch (e) {
          if (e.response.status === 401) {
            Modal.error({"content": "登录状态失效，请重新登录"})
            window.localStorage.logged = false
            window.localStorage.token = ""
            window.localStorage.username = ""
            this.$store.state.logged = false
          } else {
            Modal.error({"content": "未知错误，请稍后再试"})
          }
        }
      }
    }
    else if (!this.reply && this.edit)
    {
      if (this.isMainPost)
      {
        try {
          let response = await axios.put(`/api/v1/post/${this.postId}`, {
            "title": this.value,
            "content": this.content
          })
          if (response.status === 200) {
            Modal.success({"content":"修改主帖成功, 请刷新后查看"})
          }
        }catch (e) {
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
      else
      {
        try{
          let response = await axios.put(`/api/v1/post/${this.postId}/reply/${this.replyId}`, {
            "content": this.content
          })
          if (response.status === 200) {
            Modal.success({"content":"修改评论成功, 请刷新后查看"})
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
    }
  }

  addEmoji(item){
    this.content = this.content + `<img src="${item.name}" width="40px" alt="emoji"/>`
  }

  remove(){
    this.content = ""
  }

}
</script>

<style scoped>
.main {
  width: 800px;
}
.option {
  display: flex;
}

.option-2 {
  display: flex;
  justify-content: space-around;
}

.button-1 {
  flex-grow: 1;
}

.button-2 {

}

</style>