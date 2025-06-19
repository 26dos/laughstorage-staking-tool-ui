import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { userAppToken } from 'src/dist/api'
import { useDAppStore } from 'src/stores/d-app'

const api = axios.create({ baseURL: process.env.DEV ? 'http://127.0.0.1:9002/api' : '/api' })

export default defineBoot(({ app }) => {
  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${userAppToken.get()}`
    return config
  })
  api.interceptors.response.use((response) => {
    const data = response.data
    if (data.code !== 0) {
      console.log('data', data)
      if (data.code == 61) {
        const dAppStore = useDAppStore()
        dAppStore.loginOut()
      }
      throw data
    }
    return data
  })
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
