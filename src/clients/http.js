const https = require('https')
const http = require('http')

// rejects on >= HTTP 300
async function requestPromise(url, options = {}, body) {
  const isHttps = url.startsWith('https:') || options.protocol === 'https:'
  const httpLib = isHttps ? https : http
  return new Promise((resolve, reject) => {
    let data
    const req = httpLib.request(url, options, res => {
      const contentTypes = res.headers['content-type']
      if (contentTypes && contentTypes.includes('image')) {
        res.setEncoding('binary')
      }
      res.on('data', chunk => {
        data === undefined ? (data = chunk) : (data = data + chunk)
      })
      res.on('end', () =>
        res.statusCode < 300 ? resolve(data) : reject({ res, data })
      )
    })
    if (body) {
      req.write(body)
    }
    req.on('error', error => reject({ error, res, data }))
    req.end()
  })
}

function post(url, body, options = {}) {
  return requestPromise(
    url,
    {
      method: 'POST',
      ...options,
      headers: { 'content-type': 'application/json', ...options.headers }
    },
    JSON.stringify(body)
  )
}

function postRaw(url, body, options = {}) {
  return requestPromise(
    url,
    {
      method: 'POST',
      ...options
    },
    body
  )
}

module.exports = { get: requestPromise, post, postRaw }
