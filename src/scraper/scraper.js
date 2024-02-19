const { getRandomTime, getRandomAgent } = require("./utils.js");
const axios = require("axios");
const cheerio = require("cheerio");
const { get } = require("http");
let stocks = [];

async function scrapeStocks() {
    try {
        const response = await axios.get("https://finance.yahoo.com/most-active/", {
            headers: {
                "User-Agent": getRandomAgent(),
            },
        });

        const $ = cheerio.load(response.data);
        $("table tbody tr").each((index, element) => {
            if (index < 10) {
                const symbol = $(element).find("td:nth-child(1) a").text();
                const name = $(element).find("td[aria-label='Name']").text();
                const price = $(element).find("td[aria-label='Price (Intraday)'] > fin-streamer").attr("value");
                const change = $(element).find("td[aria-label='Change'] > fin-streamer").attr("value");
                const changePerc = $(element).find("td[aria-label='% Change'] > fin-streamer").attr("value");
                stocks.push({ symbol, name, price, change, changePerc });
            }
        });

        const delay = getRandomTime(2000, 12000); //gets random time berween 2 and 5 seconds
        await Promise((resolve) => setTimeout(resolve, delay)); //resolves promise in delayed seconds
    } catch (error) {
        console.error("Error:", error.message);
    }
}

module.exports = { stocks };
