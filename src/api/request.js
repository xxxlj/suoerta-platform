import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE // api的base_url
  // timeout: 1000 // request timeout
})
axios.defaults.withCredentials = true // 让请求头携带cookie
// request interceptor
service.interceptors.request.use(config => {
  return config
}, error => {
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error)
  })

export default service
