const amazon = require("../utils/amazonScraper");
const noon = require("../utils/noonScraper");

exports.search = async (query, sources = ["noon", "amazon"]) => {
  const tasks = [];

  if (sources.includes("noon")) tasks.push(noon(query));
  if (sources.includes("amazon")) tasks.push(amazon(query));

  const settled = await Promise.allSettled(tasks);

  const results = settled.reduce((acc, s) => {
    if (s.status === "fulfilled" && Array.isArray(s.value)) {
      return acc.concat(s.value);
    }
    return acc;
  }, []);

  return results;
};
