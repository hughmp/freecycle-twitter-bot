const config = require('../config')
const http = require('./http')
const Twit = require('twit')

const T = new Twit({
  consumer_key: config.twitter.consumer.key,
  consumer_secret: config.twitter.consumer.secret,
  access_token: config.twitter.token.key,
  access_token_secret: config.twitter.token.secret
})

function tweet(status, options = {}) {
  return T.post('statuses/update', { status, ...options })
}

async function tweetWithImage(status, imageBinary, altText = '') {
  const {
    data: { media_id_string: media_id }
  } = await T.post('media/upload', {
    media_data: Buffer.from(imageBinary, 'binary').toString('base64')
  })

  await T.post('media/metadata/create', {
    media_id,
    alt_text: { text: altText }
  })

  await tweet(status, { media_ids: [media_id] })

  /*
  data: {
    media_id: 1160660704531271700,
    media_id_string: '1160660704531271681',
    size: 61857,
    expires_after_secs: 86400,
    image: { image_type: 'image/jpeg', w: 600, h: 450 }
  }
  */
}

module.exports = { tweet, tweetWithImage }
