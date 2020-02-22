import Vue from 'vue'
import VueRouter from 'vue-router'
import Summarizer from '../views/Summarizer'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
  },
  {
    path: '/app/summarizer',
    name: 'Summarizer',
    component: Summarizer
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
