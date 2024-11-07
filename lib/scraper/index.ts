import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

import puppeteer from "puppeteer";

export async function scrapeAmazonProduct(url: string) {
   if (!url) return;

   const browser = await puppeteer.launch({
      headless: false,
      args: ["--proxy-server=brd.superproxy.io:22225"],
   });

   const page = await browser.newPage();

   await page.authenticate({
      username: "brd-customer-hl_70956d86-zone-price_tracker",
      password: "50mxy16rlq99",
   });

   await page.goto('https://www.amazon.com/');
   await page.screenshot({ path: "example.png" });

   await browser.close();
}

// export async function scrapeAmazonProduct(url: string) {
//    if (!url) return;

//    //BrightData Proxy configuration
//    const username = String(process.env.BRIGHT_DATA_USERNAME);
//    const password = String(process.env.BRIGHT_DATA_PASSWORD);
//    const port = 22225;
//    const session_id = (1000000 * Math.random()) | 0;

//    const options = {
//       auth: {
//          username: `${username}-session-${session_id}`,
//          password,
//       },
//       host: "brd.superproxy.io",
//       port,
//       rejectUnauthorized: false,
//       headers: {
//          "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//          Accept:
//             "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//          "Accept-Language": "en-US,en;q=0.9",
//          "Accept-Encoding": "gzip, deflate, br",
//          "Cache-Control": "max-age=0",
//          "Sec-Ch-Ua":
//             '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
//          "Sec-Ch-Ua-Mobile": "?0",
//          "Sec-Ch-Ua-Platform": '"Windows"',
//          "Sec-Fetch-Dest": "document",
//          "Sec-Fetch-Mode": "navigate",
//          "Sec-Fetch-Site": "none",
//          "Sec-Fetch-User": "?1",
//          "Upgrade-Insecure-Requests": "1",
//       },
//    };

//    try {
//       //fetch the product page
//       const response = await axios.get(url, options);
//       const $ = cheerio.load(response.data);

//       //extract the product title
//       const title = $("#productTitle").text().trim();
//       let currentPrice = extractPrice(
//          $(".apexPriceToPay"),
//          $(".priceToPay"),
//          $(".a-price.a-text-price.priceToPay"),
//          $(".a-button-selected .a-color-base"),
//          $(".a-price"),
//          $("#priceblock_ourprice"),
//          $(".a-price-whole")
//       );

//       let originalPrice = extractPrice(
//          $('.a-price.a-text-price[data-a-strike="true"]'),
//          $('.a-price.a-text-price span[aria-hidden="true"]'),
//          $("#listPrice"),
//          $("#priceblock_dealprice"),
//          $(".a-size-small.a-color-secondary.aok-align-center.basisPrice")
//       );

//       const isOutOfStock =
//          $("#availability span").text().trim().toLowerCase() ===
//          "currently unavailable";

//       const images =
//          $("#imgBlkFront").attr("data-a-dynamic-image") ||
//          $("#landingImage").attr("data-a-dynamic-image") ||
//          "{}";

//       const imageUrls = Object.keys(JSON.parse(images));

//       const currency = extractCurrency($(".a-price-symbol"));

//       const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

//       const description = extractDescription($);

//       //construct data object with scraped information
//       const data = {
//          url,
//          title,
//          currency: currency || "$",
//          image: imageUrls[0],
//          currentPrice: Number(currentPrice) || Number(originalPrice),
//          originalPrice: Number(originalPrice) || Number(currentPrice),
//          priceHistory: [{price: Number(currentPrice) || Number(originalPrice)}],  //price history starts with the current price when its scraped,the original price is not considered in the price history
//          discountRate: Number(discountRate),
//          description, // not working as intended
//          category: "category", //need to scrape
//          reviewsCount: 0, //need to scrape
//          stars: 0, //need to scrape
//          isOutOfStock,
//          lowestPrice: Number(currentPrice) || Number(originalPrice),
//          highestPrice: Number(originalPrice) || Number(currentPrice),
//          averagePrice: Number(currentPrice) || Number(originalPrice),
//       };

//       console.log(data);

//       return data;
//    } catch (error: any) {
//       throw new Error(`Failed to scrape product: ${error.message}`);
//    }
// }
