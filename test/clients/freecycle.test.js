const nock = require('nock')
const fs = require('fs')
const path = require('path')
const config = require('../../src/config')
const freecycle = require('../../src/clients/freecycle')

// fixtures
const countriesJsonFixture = require('../fixtures/countries.json')
const countriesHtmlFixture = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/countries.html'),
  'utf8'
)

// nock configuration
const { protocol, host, pathname, search } = new URL(
  config.freecycle.countriesUrl
)
nock(`${protocol}//${host}`)
  .get(pathname + search)
  .reply(200, countriesHtmlFixture)

// tests
describe('freecycle client', () => {
  it('parses countries', async () => {
    const c = await freecycle.getCountries()
    expect(c).toEqual(countriesJsonFixture)
  })
})
