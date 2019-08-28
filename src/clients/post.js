const db = require('./db')
const http = require('./http')

function getOfferPostsNotTweeted() {
  return db.findAll('post', {
    where: { isTweeted: false, json: { type: 'offer' } }
  })
}

async function getPhoto(post = {}) {
  try {
    const { imageUrl } = post
    const image = await http.get(imageUrl)
    return image
  } catch (e) {
    return false
  }
}

module.exports = { getOfferPostsNotTweeted, getPhoto }
