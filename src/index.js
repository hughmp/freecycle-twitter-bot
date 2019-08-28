const london = require("./clients/london");
const sync = require("./clients/sync");

function scraper() {
  london.scrapeLondon().catch(console.error);
}

function tweeter() {
  sync.syncTweets().catch(console.error);
}

setInterval(scraper, 1000 * 60 * 5);
console.log("scraper daemon started...");
setInterval(tweeter, 1000 * 30);
console.log("tweeter daemon started...");
