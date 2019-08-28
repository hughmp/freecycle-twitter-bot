const {
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PORT,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET
} = process.env

const postgres = {
  username: POSTGRES_USERNAME || 'hugh',
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE || 'rdb',
  host: POSTGRES_HOST || '51.159.26.77',
  port: Number(POSTGRES_PORT) || 65009
}

const twitter = {
  consumer: {
    key: TWITTER_CONSUMER_KEY || 'e6ueiTc6U8lfcvDOYx5iG1gK1',
    secret: TWITTER_CONSUMER_SECRET
  },
  token: {
    key:
      TWITTER_ACCESS_TOKEN ||
      '1155241091907620864-RC8RcpxNVJ6kD9TbrcrZVlQjZztCtq',
    secret: TWITTER_ACCESS_SECRET
  }
}

module.exports = { postgres, twitter }
