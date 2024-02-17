// import Vue from 'vue'
// import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Vue.use(VueRouter)

const routes = [
  {
    path: '/okr/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/okr/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

export default routes
