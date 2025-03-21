import axios from 'axios'
import { showToast } from 'vant'
import store from '@/store/index'
import router from '@/router/index'
import { BASE_ADDRESS } from '@/config'

const instance = axios.create({
  //baseURL: process.env.NODE_ENV === 'development' ? "/api" : BASE_ADDRESS,
  baseURL: BASE_ADDRESS,
  timeout: 15000,
  transformRequest: [
    function (data, headers) {
      if (headers['Content-Type'] == 'multipart/form-data') return data
      return JSON.stringify(data)
    }
  ]
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    config.sslVerify = false
    // config.headers["deviceId"] = store.state.deviceId;
    const { token } = store.state
    if (token) {
      config.headers.auth = token
    }
    if (config?.custom?.auth && !token) {
      // router.replace({
      //   name: 'login',
      //   query: {
      //     reurl: router.currentRoute.value.name
      //   }
      // })
      router.replace({
        name: 'home',
      })
      store.commit('setIsLoginOpen', true)
      console.error(config)
      throw {
        message: '当前 token 已失效，请重新登录',
      }
      return
    }
    config.headers.lang = 'en_US'
    config.headers['Content-Type'] = 'application/json'
    if (config && config.custom && config.custom['Content-Type']) {
      config.headers['Content-Type'] = config.custom['Content-Type']
    }
    if (config && config.custom && config.custom.responseType) {
      config.headers.responseType = config.custom.responseType
    }
    // console.log(`--- 请求 ${config.url} 参数 ---`);
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // console.log(`--- 请求 ${response.config.url} 返回 ---`, response.data);
    const res = response.data
    const custom = response.config?.custom
    if (res.code != 200) {
      if (res.code == 401) {
        if (location.href.includes('/login')) {
          return
        }
        store.dispatch('reset')
        // router.push({
        //   name: 'login',
        //   query: {
        //     reurl: router.currentRoute.value.name
        //   }
        // })
        router.replace({
          name: 'home',
        })
        store.commit('setIsLoginOpen', true)
        return
      }
      const newShowToast = params => {
        setTimeout(() => {
          showToast(params)
        }, 300)
      }
      if (res.message == 'fund_password_wrong' || res.message == 'Wrong fund password') {
        res.message = '交易密码错误'
      }
      if (custom.toast) {
        setTimeout(() => {
          if (res.code == 1010) reurn
          showToast(res.message || '服务端异常')
        }, 600)
      }
      return Promise.reject(res)
    }
    return res || {}
  },
  async function (error) {
    if (error?.config?.custom?.retry) {
      if (!error.config) return Promise.reject(error)
      error.config._retryTimes = error.config._retryTimes ? error.config._retryTimes + 1 : 1
      if (error.config._retryTimes > 3) return Promise.reject(error) // 重试3次
      try {
        error.config.data = JSON.parse(error.config.data)
      } catch { }
      return instance(error.config)
    }
    showToast(error.message || '网络异常,请重试')
    return Promise.reject(error)
  }
)

export default instance
