// 封装常用请求接口
import axios from 'axios'
import { ElMessage } from 'element-plus'
const axiosIns = axios.defaults as any
//修改axios一些默认配置参数
axiosIns.timeout = 15000
//可在config/dev.env.js 或者 prod.env.js获取对应url地址头
axiosIns.baseURL = process.env.VUE_APP_BASE_API
axiosIns.responseType = 'json'
axiosIns.isRetryRequest = false
axiosIns.headers = {
  'Content-Type': 'application/json;charset=UTF-8',
  'CHANNEL-TYPE': 'PC'
}

// request拦截器
// axios.interceptors.request.use(
//   (config) => {
//     //每次请求前判断是否存在token
//     //如果存在则统一在http请求的header中加上token
//     //从cookie中获取
//     const token = getToken()
//     if (token) {
//       config.headers.Authorization = `${token}`
//     }

//     let jsonEncryptionItems = localStorage.getItem('ENCRYPTION_ITEMS') || '[]'
//     let encryptionItem = JSON.parse(jsonEncryptionItems)

//     if (config.method == 'post' || config.method == 'put') {
//       let type = Object.prototype.toString.call(config.data)
//       if (!type.includes('FormData')) {
//         let tmpData = JSON.stringify(config.data)
//         config.data = JSON.parse(tmpData)
//       }
//       //遍历脱密的数据
//       util.encryption(config.data, encryptionItem)
//     } else {
//       let tmpData = JSON.stringify(config.params)
//       config.data = JSON.parse(tmpData)
//       util.encryption(config.params, encryptionItem)
//     }
//     return config
//   },
//   (error) => {
//     // Do something with request error
//     console.error(error) // for debug
//     Promise.reject(error)
//   }
// )

// respone拦截器
axios.interceptors.response.use(
  (response) => {
    const res = response.data
    if (Object.keys(res).includes('status') && res.status !== 200) {
      return Promise.reject(res.msg)
    } else {
      return response
    }
    // return response
    //登录超时
    // if (res.retCode == '22009' || res.retCode == '22008') {
    //   ElMessage ({
    //     showClose: true,
    //     message: res.retMsg,
    //     type: 'error',
    //     duration: 3 * 1000,
    //     onClose: () => {
    //       // store.dispatch('FedLogOut').then(() => {
    //       //   location.reload()
    //       // })
    //     }
    //   })
    //   return Promise.reject('未登录')
    //   //全局错误提示
    // } else if (res.retCode == '22007') {
    //   removeToken()
    //   let token = setToken(response.headers.authorization)
    //   let config = response.config
    //   if (!config.isRetryRequest) {
    //     config.headers.Authorization = token
    //     let url = response.config.url
    //     let param = response.config.data
    //     config.url = url.substr(4)
    //     config.isRetryRequest = true
    //     return axios(config)
    //   }
    // } else if (res.retCode == '22001') {
    //   router.push('/nopermission')
    // } else {
    //   if (response.data) {
    //     //指定字段脱密
    //     let jsonEncryptionItems =
    //       localStorage.getItem('ENCRYPTION_ITEMS') || '[]'
    //     let encryptionItem = JSON.parse(jsonEncryptionItems)
    //     util.decryption(response.data, encryptionItem)
    //   }

    // }
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误（400）'
          break
        case 401:
          error.message = ' 未授权请重新登陆（401）'
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload()
          // })
          break
        case 403:
          error.message = '请求错误（403）'
          break
        case 404:
          error.message = '请求错误（404）'
          break
        case 408:
          error.message = '请求错误（408）'
          break
        case 501:
          error.message = '请求错误（501）'
          break
        case 502:
          error.message = '请求错误（502）'
          break
        case 503:
          error.message = '请求错误（503）'
          break
        case 504:
          error.message = '请求错误（504）'
          break
        case 505:
          error.message = '请求错误（505）'
          break
        default:
          error.massage = `连接出错（${error.response.status}）!`
      }
    } else {
      error.message = '连接服务器失败！'
    }
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

function validatePass(data: any) {
  const pass = /(<(no)?script[^>]*.*?<\/(no)?script>)+/g.test(
    JSON.stringify(data)
  )
  const pass1 = /(eval\((.*?)\))+/g.test(JSON.stringify(data))
  const pass2 = /(expression\((.*?)\))+/g.test(JSON.stringify(data))
  const pass3 = /(javascript:|vbscript:|view-source:)+/g.test(
    JSON.stringify(data)
  )
  const pass4 =
    /((window\.|\.location|document\.|alert\(.*?\)|window\.open\())+/g.test(
      JSON.stringify(data)
    )
  const pass5 =
    /(<+\s*\w*\s*(oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondblclick|ondeactivate|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onerror=|onerroupdate|onfilterchange|onfinish|onfocus|onfocusin|onfocusout|onhelp|onkeydown|onkeypress|onkeyup|onlayoutcomplete|onload|onlosecapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmousout|onmouseover|onmouseup|onmousewheel|onmove|onmoveend|onmovestart|onabort|onactivate|onafterprint|onafterupdate|onbefore|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onblur|onbounce|oncellchange|onchange|onclick|oncontextmenu|onpaste|onpropertychange|onreadystatechange|onreset|onresize|onresizend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onselect|onselectionchange|onselectstart|onstart|onstop|onsubmit|onunload)+\s*=+)+/g.test(
      JSON.stringify(data)
    )
  return pass || pass1 || pass2 || pass3 || pass4 || pass5
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {promise}
 * */
export function get(url = '', params = {}) {
  if (validatePass(params)) {
    alert('禁止输入不合法字符！')
    location.reload()
  } else {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params
        })
        .then((response) => {
          if (response) {
            resolve(response.data)
          } else {
            resolve({})
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
/**
 * 封装post方法
 * @param url
 * @param data
 * @returns {promise}
 * */
export function post(url = '', data = {}) {
  if (validatePass(data)) {
    alert('禁止输入不合法字符！')
    location.reload()
  } else {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((response: any) => {
          resolve(response.data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }
}

/**
 * 封装delete方法
 * @param url
 * @param data
 * @returns {promise}
 * */
export function del(url = '', params = {}) {
  if (validatePass(params)) {
    alert('禁止输入不合法字符！')
    location.reload()
  } else {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, {
          params: params
        })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

/**
 * 封装exportFile方法
 * @param url
 * @param data
 * @returns {promise}
 * */
export function exportFile(url = '', params: any) {
  if (validatePass(params)) {
    alert('禁止输入不合法字符！')
    location.reload()
  } else {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params,
          responseType: 'blob'
        })
        .then((response: any) => {
          resolve(response.data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }
}
