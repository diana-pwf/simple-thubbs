import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Personal from '../views/Personal.vue'
import PostDetail from "@/views/PostDetail.vue";

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/personal',
    name: 'Personal',
    component: Personal
  },
  {
    path: '/detail/:postId',
    name: 'PostDetail',
    component: PostDetail
  }
]

const router = new VueRouter({
  routes
})

export default router
