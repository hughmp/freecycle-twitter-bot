function waitMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function safeJSONParse(data) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

module.exports = { waitMs, safeJSONParse }
