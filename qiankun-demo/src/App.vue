<template>
  <div id="app" class="app">
    <el-menu
      default-active="2"
      class="app-menu"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="onSelect"
    >
      <el-menu-item :index="item.value" :key="item.value" v-for="item in menus">
        <span class="el-icon-document"></span>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
    <div class="app-main"></div>
    <!-- <div
      class="app-main"
      :class="`app-main-${item.name}`"
      :key="item.name"
      v-for="item in apps"
      v-show="curApp && curApp.name === item.name"
    ></div> -->
  </div>
</template>

<script>
import {
  registerMicroApps,
  start,
  initGlobalState,
  prefetchApps,
  loadMicroApp,
} from 'qiankun'
import ElementUI from 'element-ui'

export default {
  data() {
    let host = location.host.split(':')[0]
    let isDev = process.env.NODE_ENV !== 'production'

    window.childVmMap = {}
    let props = {
      components: {},
      plugins: {},
      methods: {
        initAfter: ({ vm }) => {
          // 全局
          window.vm = vm
          window.childVmMap[this.curApp.name] = vm
          console.log('initAfter', this.curApp, vm, window.childVmMap)
        },
        init: ({ Vue: ChildVue, ajaxList }) => {
          // 插件
          ChildVue.use(ElementUI)

          // 原型
          // ajax
          ChildVue.prototype.$ajax = {
            ...this.$ajax,
            ...ajaxList,
          }
        },
      },
    }

    return {
      curApp: null,
      apps: [
        {
          name: 'okr',
          entry: `//${host}${isDev ? ':8081' : ''}`,
          container: '.app-main', // -okr
          activeRule: '#/okr',
          props,
        },
        {
          name: 'task',
          entry: `//${host}${isDev ? ':8082' : ''}`,
          container: '.app-main', // -task
          activeRule: '#/task',
          props,
        },
      ],
      menus: [
        {
          label: '目标',
          value: 'okr',
          // url: 'http://localhost:8081/app-okr'
        },
        {
          label: '任务',
          value: 'task',
          // url: '/app-task'
        },
        // {
        //   label: '总结',
        //   value: 'sum',
        //   url: '/app-sum'
        // },
      ],
    }
  },
  methods: {
    onSelect(val, path) {
      // console.log('onSelect', val, path)

      // 卸载上一个微应用
      // if (this.preVal) {
      //   let preApp = this.appMap[this.preVal]
      //   if (preApp) preApp.unmount()
      // }

      // 已经加载过微应用
      // let app = this.appMap[val]
      // if (app) {
      //   app.mount()
      // } else {

      // }

      switch (val) {
        case 'okr':
          location.href = location.href.split('#')[0] + '#/okr/home'
          // 如果微应用和 url 路径没关系，则可以自己手动加载微应用，否则可以用
          // this.appMap.okr = loadMicroApp({
          //   name: 'okr',
          //   entry: '//localhost:8081',
          //   container: '.app-main',
          //   activeRule: '#/okr',
          // })
          break

        case 'task':
          location.href = location.href.split('#')[0] + '#/task/home'
          // this.appMap.task = loadMicroApp({
          //   name: 'task',
          //   entry: '//localhost:8082',
          //   container: '.app-main',
          //   activeRule: '#/task',
          // })
          break
      }

      this.preVal = val
    },
  },
  mounted() {
    // this.appMap = {}

    // 手动预加载微应用资源，配合 loadMicroApp 提高效率
    // prefetchApps([
    //   { name: 'okr', entry: '//localhost:8081' },
    //   { name: 'task', entry: '//localhost:8082' },
    // ])

    // 提供全局变量
    // let state = {
    //   text: 'root'
    // }
    // let actions = initGlobalState(state)
    // actions.onGlobalStateChange((state, prev) => {
    //   // state: 变更后的状态; prev 变更前的状态
    //   console.log('主应用 onGlobalStateChange', state, prev);
    // })
    // actions.setGlobalState(state)

    // 启动 qiankun
    registerMicroApps(this.apps, {
      // beforeLoad: (app) => {
      //   this.curApp = app
      //   console.log('before load', app)
      // },
      beforeMount: [
        (app) => {
          this.curApp = app
          console.log('before mount', app)
        },
      ],
    })

    start()
  },
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  height: 100%;
}

.app-menu {
  width: 160px;
  height: 100%;
}

.app-main {
  flex: 1;
  overflow: hidden;
  height: 100%;
}
</style>
