const cheerio = require("cheerio");
const { get } = require("./http");

const FREECYCLE_COUNTRIES_URL =
  "https://www.freecycle.org/browse?noautodetect=1";

async function getParsedHtml(url) {
  const text = await get(url);
  return cheerio.load(text);
}

function parseLinks(html, columnStartsWithText) {
  return html(`section[id^=${columnStartsWithText}] ul li a`)
    .map((i, el) => {
      const a = html(el);
      return {
        label: a.text(),
        url: a.attr("href").replace(/^http:/i, "https:")
      };
    })
    .get();
}

async function getCountries() {
  const html = await getParsedHtml(FREECYCLE_COUNTRIES_URL);
  return parseLinks(html, "country_column_");
}

async function getRegions(countryUrl) {
  const html = await getParsedHtml(countryUrl);
  return parseLinks(html, "region_column_").map(r => ({
    ...r,
    country: countryUrl
  }));
}

async function getGroups(countryOrRegionUrl, type) {
  const html = await getParsedHtml(countryOrRegionUrl);
  return parseLinks(html, "group_column_").map(g => ({
    ...g,
    [type]: countryOrRegionUrl
  }));
}

async function getPosts(groupUrl, page = 1) {
  const url = `${groupUrl}/posts/all?page=${page}`;
  const html = await getParsedHtml(url);
  const table = html("#group_posts_table");
  const rows = html(table).find("tr");
  const [_, first, last, total] =
    table
      .next()
      .text()
      .match(/showing (\d+) to (\d+) of (\d+) results/i) || [];
  const posts = rows
    .map((i, el) => {
      const columns = html(el).children("td");
      const leftCell = html(columns[0])
        .text()
        .split("\n");
      const type = (leftCell[1].match(/\w+/gi) || [])[0] || "";
      const id = leftCell[3].trim().replace(/[#,(,)]/g, "");
      const col2 = html(columns[1]);
      const area = col2
        .text()
        .split("\n")[1]
        .trim()
        .match(/\(.+$/);
      const a = col2.children("a");
      return {
        id,
        type: type.toLowerCase(),
        date: leftCell[2].trim(),
        label: a.text(),
        url: a.attr("href"),
        area:
          (Array.isArray(area) && area[0].replace(/[(,)]/g, "").trim()) || null,
        imageUrl: groupUrl + "/post_image/" + id
      };
    })
    .get();

  return {
    first: Number(first),
    last: Number(last),
    total: Number(total),
    count: posts.length,
    posts
  };
}

module.exports = { getPosts, getCountries, getRegions, getGroups };

// getPosts("https://groups.freecycle.org/group/KensingtonandChelseaUK")
//   .then(console.log)
//   .catch(console.error);
