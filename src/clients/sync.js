const freecycle = require('./freecycle')
const db = require('./db')
const stream = require('stream')
const { waitMs } = require('../utils')
const post = require('./post')
const twitter = require('./twitter')

async function syncCountries() {
  const countries = await freecycle.getCountries()
  await db.insertOrUpdate('country', countries)
  console.log(`[syncCountries] upserted ${countries.length} countries`)
  return true
}

async function syncRegions(countryUrl) {
  if (!countryUrl) throw new Error('no countryUrl provided')
  const regions = await freecycle.getRegions(countryUrl)
  await db.insertOrUpdate('region', regions)
  console.log(`[syncRegions] upserted ${regions.length} regions`)
  return regions
}

async function syncGroups(countryOrRegionUrl, type) {
  const TYPES = ['country', 'region']
  if (!TYPES.includes(type))
    throw new Error(`type must be one of: ${TYPES.join(' | ')}`)
  const groups = await freecycle.getGroups(countryOrRegionUrl, type)
  await db.insertOrUpdate('group', groups)
  console.log(`[syncGroups] upserted ${groups.length} groups`)
  return groups
}

function createPostTransformStream(groupUrl) {
  function transform(posts, encoding, cb) {
    const transformed = posts.map(p => ({
      id: p.id,
      group: groupUrl,
      json: p
    }))
    cb(null, transformed)
  }
  return new stream.Transform({ transform, objectMode: true })
}

async function* createPostsGenerator(groupUrl, limit = 100) {
  let _page = 1
  let _posts = []
  let _totalPostsCount = 0
  while (true) {
    const { posts } = await freecycle.getPosts(groupUrl, _page)
    _posts = posts
    _totalPostsCount += posts.length
    const oldestPost = _posts[_posts.length - 1]
    if (!oldestPost) break
    const isOldestPostInDb = await db.findByPk('post', oldestPost.id)
    if (isOldestPostInDb) break
    _page++
    if (_totalPostsCount >= limit) break
    await waitMs(Math.random() * 2000)
    yield _posts
  }
  yield _posts
  console.log(`${_totalPostsCount} posts scraped for ${groupUrl}`)
}

function createPostWriteStream() {
  return new stream.Writable({
    write(posts, encoding, callback) {
      db.insertOrUpdate('post', posts)
        .then(() => callback())
        .catch(callback)
    },
    objectMode: true
  })
}

function syncPosts(groupUrl, limit) {
  return new Promise((resolve, reject) => {
    const postGenerator = createPostsGenerator(groupUrl, limit)
    const postTransformStream = createPostTransformStream(groupUrl)
    const postWriteStream = createPostWriteStream()

    stream.Readable.from(postGenerator)
      .pipe(postTransformStream)
      .pipe(postWriteStream)

    postWriteStream.on('finish', resolve)
  })
}

function offerToStatus(offer) {
  const { label, area, url } = offer
  return `${label}\n(${area})\n${url}\n#freecycle`
}

async function syncTweets() {
  const p = await post.getOfferPostsNotTweeted()
  await p.reduce(async (chain, offer) => {
    try {
      await chain
      const photo = await post.getPhoto(offer.json)
      const status = offerToStatus(offer.json)
      if (photo) {
        await twitter.tweetWithImage(status, photo, offer.json.label)
      } else {
        await twitter.tweet(status)
      }
      await db.update('post', { isTweeted: true }, { id: offer.id })
      console.log(`tweeted ${offer.id}`)
    } catch (e) {
      console.error(`error tweeting ${offer.id}`)
      console.error(e)
    }
  }, Promise.resolve())
}

module.exports = { syncGroups, syncPosts, syncTweets }
