const { syncGroups, syncPosts } = require("./sync");

const REGION_URL = "https://www.freecycle.org/browse/UK/London";

async function scrapeLondon() {
  const groups = await syncGroups(REGION_URL, "region");
  await groups.reduce(async (chain, group) => {
    await chain;
    await syncPosts(group.url);
  }, Promise.resolve());
}

module.exports = { scrapeLondon };
