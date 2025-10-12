import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { run } from './src/main.js'

// ES Module 中获取 __dirname 的方法
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3000

// 中间件，用于解析 JSON 请求体和提供静态文件
app.use(express.json({ limit: '50mb' })) // 增大请求体大小限制以处理大型脚本
app.use(express.static(path.join(__dirname, 'public')))

// API 路由，用于解密
app.post('/api/decrypt', async (req, res) => {
  const { code, type } = req.body

  if (!code || !type) {
    return res.status(400).json({ error: 'Missing code or type for decryption.' })
  }

  console.log(`[Server] Received request for type: ${type}`)

  try {
    // 调用改造后的核心解密函数
    const decryptedCode = await run(code, type)

    if (decryptedCode) {
      console.log(`[Server] Decryption successful for type: ${type}`)
      res.json({ decryptedCode })
    } else {
      console.error(`[Server] Decryption failed for type: ${type}. The function returned null.`)
      res.status(500).json({ error: 'Decryption failed. The script might not be supported or an internal error occurred.' })
    }
  } catch (error) {
    console.error(`[Server] An exception occurred during decryption for type: ${type}`, error)
    res.status(500).json({ error: `An internal error occurred: ${error.message}` })
  }
})

// 启动服务器
app.listen(port, () => {
  console.log(`JS Decryptor server is running on http://localhost:${port}`)
})
