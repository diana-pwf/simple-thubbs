<template>
  <div id="center">
    <div id="left">
      <img src="login.jpg" alt="">
    </div>
    <div id="right">
      <div id="title">
      <img id="icon" src="icon.png" width="50px" alt="">
      <h1>清软论坛</h1>
      </div>
      <div id="form-body">
        <a-input class="user" placeholder="input username" v-model="username">
        <a-icon slot="prefix" type="user"></a-icon>
        </a-input>
        <a-input-password class="password" placeholder="input password" v-model="password">
          <a-icon slot="prefix" type="lock"></a-icon>
        </a-input-password>
      <a-button id="button" type="primary" v-on:click="login()">OK</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {Component, Vue} from 'vue-property-decorator';
import {Modal} from "ant-design-vue";

@Component
export default class Login extends Vue {
  username = ""
  password = ""

  async login() {
    try{
      let response = await axios.patch('/api/v1/login', {
        username: this.username,
        password: this.password
      })
      if (response.status === 200) {
        window.localStorage.logged = true
        this.$store.state.logged = true
        window.localStorage.token = response.data.jwt
        window.localStorage.username = this.username
        this.$global.username = this.username
        axios.defaults.headers.common["Authorization"] = window.localStorage.token
        response = await axios.get('/api/v1/user', {})
        window.localStorage.userId = response.data.id
      }
    }
    catch (e) {
      if (e.response.status === 400)
      {
        Modal.error({"content":"用户名或密码错误，请重新输入"})
      }
      else
      {
        Modal.error({"content":"未知错误，请稍后再试"})
      }
    }
  }
}
</script>

<style scoped>
#center {
  width: 800px;
  height: 600px;
  margin: auto;
  position: relative;
  top: 100px;
  display: flex;
  align-items: center;
}

#form-body {
  width: 300px;
  margin-left: 20px;
}

.user {
  margin-bottom: 20px;
}

.password {
  margin-bottom: 20px;
}

#button {
  grid-column-start: 2;
}

#title {
  display: flex;
  justify-content: center;
  align-items: center;
}

#icon {
  margin: 20px;
}

</style>