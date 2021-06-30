<template>
  <a-collapse>
  <a-collapse-panel header="自定义表情面板" :style="'background: #f7f7f7;border-radius: 4px;border: 0;overflow: hidden'">
    <div>
      <ul id="example">
        <li v-for="item in emojiList" :key="item.name">
          <img :src="item.name" v-on:click="sendEmoji(item)" alt="emoji"/>
        </li>
      </ul>
    </div>
    </a-collapse-panel>
  </a-collapse>
</template>


<script>
import {Component, Vue} from 'vue-property-decorator';


@Component({
  components: { }
})

export default class VEmoji extends Vue {

  emojiList = [{name: "0.jpg"}, {name: "1.jpg"}, {name: "2.jpg"}, {name: "3.jpg"},
    {name: "4.jpg"}, {name: "5.jpg"}, {name: "6.jpg"}, {name: "7.jpg"},
    {name: "8.jpg"}, {name: "9.jpg"}, {name: "10.jpg"}, {name: "11.jpg"},
    {name: "12.jpg"}, {name: "13.jpg"}, {name: "14.jpg"}, {name: "15.jpg"},
    {name: "16.jpg"}, {name: "17.jpg"}, {name: "18.jpg"}, {name: "19.jpg"},
    {name: "20.jpg"}, {name: "21.jpg"}, {name: "22.jpg"}, {name: "23.jpg"},
    {name: "24.jpg"}, {name: "25.jpg"}, {name: "26.jpg"}, {name: "27.jpg"},
    {name: "28.jpg"}, {name: "29.jpg"}, {name: "30.jpg"}, {name: "31.jpg"},
    {name: "32.jpg"}]

  sendEmoji(item){
    this.$emit('event', item)
  }
}
</script>

<style scoped>
li {
  display: inline-block;
}

img {
  width: 40px;
}

</style>