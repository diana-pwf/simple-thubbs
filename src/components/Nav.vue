<template>
  <div class="nav" style="background-color: #F5F5F5; padding: 0; margin-top: 0">
    <a-page-header @back="back()" class="pageHeader">
      <template slot="extra">
        <a-button class="writeReply" key="4" type="primary" v-on:click="showDrawer()">
          我要发帖
        </a-button>
        <a-button class="gotoMain" key="3" v-on:click="gotoMain()">
          返回首页
        </a-button>
        你好，{{currNickname}}
        <slot name="option"></slot>
        <a-button key="1"  v-on:click="preLogout()">
          登出
        </a-button>
      </template>
    </a-page-header>

    <template>
      <div>
        <a-drawer
            title="我要发帖"
            :placement="'bottom'"
            :closable="true"
            :visible="visible"
            @close="onClose"
            width="800px"
            height="400px"
        >
          <a-input class="postTitle" placeholder="请输入标题..." v-model="title"/>
          <quill-editor v-model="content" :options="editorOption"></quill-editor>
          <div class="buttons">
            <a-upload
                name="file"
                :multiple="true"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                @change="handleChange"
            >
              <a-button> <a-icon type="upload" />点击此处上传长图</a-button>
            </a-upload>
          <a-divider type="vertical" />
          <a-button v-on:click="preSend()">发送</a-button>
          <a-divider type="vertical" />
          <a-button v-on:click="removePost()">清除</a-button>
          </div>
          <VEmoji @event="addEmoji"></VEmoji>
        </a-drawer>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VEmoji from '@/components/VEmoji.vue';
import bCrop from 'b-crop'
import axios, { AxiosRequestConfig } from "axios"
import hljs from 'highlight.js'
import { Modal } from 'ant-design-vue';

@Component({
  components:{VEmoji}
})
export default class Nav extends Vue {
  visible = false
  title = ""
  content = ""

  editorOption = {
    // placeholder设置提示词
    placeholder: '请输入帖子内容......',
    // modules设置工具栏
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
        highlight: text => {console.log(text);return hljs.highlightAuto(text).value}
      },
    },

  }
  $global: any;
  $store: any;
  $router: any;

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
    return new Blob( [ab] , {type : type == 0?'image/png':'image/mp4'});
  }

  async sendFile(){
      let FormData = require('form-data');
      let data = new FormData();

      let name = Date.now().toString()
      data.append('key', name+".png");
      data.append('file', this.file);

      let config: AxiosRequestConfig = {
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

  back(){
    if (this.$router.currentRoute.path === "/" && this.$store.state.searchUserId) {
      this.$store.state.searchUserId = 0;
      return;
    }
    else
    {
      this.$router.go(-1);
    }
  }

  get currNickname(){
    return window.localStorage.username
  }

  showDrawer(){
    this.visible = true
  }

  onClose(){
    this.visible = false
  }

  gotoMain(){
    if (this.$router.currentRoute.path !== "/") {
      this.$router.push('/')
    }
  }

  preLogout() {
    Modal.confirm({"content":"确定退出当前账号吗？", "onOk":()=>this.logout()})
  }

  preSend() {
    Modal.confirm({"content":"确定发送吗？", "onOk":()=>this.sendPost()})
  }

  addEmoji(item){
    this.content = this.content + `<img src="${item.name}" width="40px" alt="emoji"/>`
  }

  async sendPost(){
    if (this.file !== null)
    {
      await this.sendFile()
    }
    axios.defaults.headers.common["Authorization"] = window.localStorage.token
    let response = await axios.post('/api/v1/post', {
      "title": this.title,
      "content": this.content
    })
    if (response.status === 200) {
      Modal.success({"content":"发帖成功, 请刷新后查看"})
    }
  }

  removePost(){
    this.content = ""
  }

  async logout() {
    axios.defaults.headers.common["Authorization"] = window.localStorage.token
    let response = await axios.patch('/api/v1/logout', {})
    if (response.status === 200) {
      window.localStorage.logged = false
      this.$store.state.logged = false

      this.$store.state.searchUserId = 0
    }
    if (this.$router.currentRoute.path !== "/") {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.nav {
  margin:auto;
}

.pageHeader {
  position: relative;
}

.writeReply {
  position: absolute;
  left: 100px;
}

.gotoMain {
  position: absolute;
  left: 200px;
}

.postTitle {
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  justify-content: space-around;
}

</style>
