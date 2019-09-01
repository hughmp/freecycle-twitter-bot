# freecycle-twitter-bot

[![Build Status](https://travis-ci.org/hughmp/freecycle-twitter-bot.svg?branch=master)](https://travis-ci.org/hughmp/freecycle-twitter-bot)
[![codecov](https://codecov.io/gh/hughmp/freecycle-twitter-bot/branch/master/graph/badge.svg)](https://codecov.io/gh/hughmp/freecycle-twitter-bot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

A microservice to periodically scrape content from `freecycle.org` and broadcast new posts as `Twitter` tweets. See the service in action [here](https://twitter.com/londonfreecycle).

**Disclaimer:** This is a prototype and not considered production ready.

## Why

The `freecycle.org` site is outdated. In advance of any future improvements, it would be nice to provide the community with a more modern interface. A `Twitter` bot is one way to offer a pub-sub style mechanism for users while at the same time minimising operational overhead.

## Architecture

The service architecture is broadly composed of three elements.

1. A scraper which parses `freecycle`'s public website using [`cheerio`](https://github.com/cheeriojs/cheerio).
2. A persistence layer which stores post history using a free managed `PostgreSQL` instance from [Scaleway](https://www.scaleway.com/en/).
3. A "tweeter" which publishes new posts to `Twitter` using the [`twit`](https://github.com/ttezel/twit) client.

The above functionality is wrapped up in a long running `NodeJS` process executed in a Docker container. [`Travis CI`](https://travis-ci.org/hughmp/freecycle-twitter-bot) is used for CI tooling.

## Development

To run in development:

1. Clone the repo.

```sh
git clone https://github.com/hughmp/freecycle-twitter-bot.git
```

2. Build the docker image.

```sh
docker build --name freecycle-twitter-bot .
```

3. Set your configuration.

```sh
export POSTGRES_USERNAME='username'
export POSTGRES_PASSWORD='password'
export POSTGRES_DATABASE='database'
export POSTGRES_HOST='host'
export POSTGRES_PORT=1234
export TWITTER_CONSUMER_KEY='abcdefghijk'
export TWITTER_CONSUMER_SECRET='lmnopqrstuvw'
export TWITTER_ACCESS_TOKEN='abcdefghijk'
export TWITTER_ACCESS_SECRET='lmnopqrstuvw'
```

4. Run the container.

```sh
docker run -d \
  --env POSTGRES_USERNAME \
  --env POSTGRES_PASSWORD \
  --env POSTGRES_DATABASE \
  --env POSTGRES_HOST \
  --env POSTGRES_PORT \
  --env TWITTER_CONSUMER_KEY \
  --env TWITTER_CONSUMER_SECRET \
  --env TWITTER_ACCESS_TOKEN \
  --env TWITTER_ACCESS_SECRET \
  freecycle-twitter-bot
```

5. Profit!

## TODO

- [ ] Improve test coverage
- [ ] Integrate continuous deployment
- [ ] Cosider implementing lightweight DB in a [`Sidecar`](https://docs.microsoft.com/en-us/azure/architecture/patterns/sidecar) pattern
- [ ] Remove secrets from build and publish public Docker image
