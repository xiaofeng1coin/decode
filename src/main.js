import Obfuscator from './plugin/obfuscator.js'
import SoJson from './plugin/sojson.js'
import SoJsonV7 from './plugin/sojsonv7.js'
import Common from './plugin/common.js'
import JsConfuser from './plugin/jsconfuser.js'
import JJEncode from './plugin/jjencode.js'
import Awsc from './plugin/awsc.js'

/**
 * 运行解密逻辑
 * @param {string} code - 需要解密的代码字符串
 * @param {string} type - 解密类型
 * @returns {string|null} - 解密后的代码或 null
 */
async function run(code, type) {
  if (!code) {
    console.error('Input code is empty.')
    return null
  }

  let result = null
  console.log(`Running decoder for type: ${type}`)

  // 使用 Promise 来处理异步的 isolated-vm
  return new Promise((resolve) => {
    try {
      switch (type) {
        case 'obfuscator':
          result = Obfuscator(code)
          break
        case 'sojson':
          result = SoJson(code)
          break
        case 'sojsonv7':
          result = SoJsonV7(code)
          break
        case 'jsconfuser':
          result = JsConfuser(code)
          break
        case 'common':
          result = Common(code)
          break
        case 'jjencode':
            result = JJEncode(code)
            break
        case 'awsc':
            result = Awsc(code)
            break
        default:
          console.error(`Unknown type: ${type}`)
          resolve(null)
          return
      }
      resolve(result)
    } catch (e) {
      console.error(`Exception in decoder type ${type}:`, e)
      resolve(null)
    }
  })
}

// 导出 run 函数，以便 server.js 可以调用
export { run }
