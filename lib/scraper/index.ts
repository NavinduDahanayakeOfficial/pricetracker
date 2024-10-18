import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
   if (!url) return;

   //BrightData Proxy configuration
   const username = String(process.env.BRIGHT_DATA_USERNAME);
   const password = String(process.env.BRIGHT_DATA_PASSWORD);
   const port = 22225;
   const session_id = (1000000 * Math.random()) | 0;

   const options = {
      auth: {
         username: `${username}-session-${session_id}`,
         password,
      },
      host: "brd.superproxy.io",
      port,
      rejectUnauthorized: false,
   };

   try {
      //fetch the product page
      const response = await axios.get(url, options);
      const $ = cheerio.load(response.data);

      //extract the product title
      const title = $("#productTitle").text().trim();
      let currentPrice = extractPrice(
         $(".apexPriceToPay"),
         $(".priceToPay"),
         $(".a-price.a-text-price.priceToPay"),
         $(".a-button-selected .a-color-base"),
         $(".a-price"),
         $("#priceblock_ourprice"),
         $(".a-price-whole")
      );

      let originalPrice = extractPrice(
         $('.a-price.a-text-price[data-a-strike="true"]'),
         $('.a-price.a-text-price span[aria-hidden="true"]'),
         $("#listPrice"),
         $("#priceblock_dealprice"),
         $(".a-size-small.a-color-secondary.aok-align-center.basisPrice")
      );

      if (!originalPrice) {
         originalPrice = currentPrice;
      }

      const outOfStock =
         $("#availability span").text().trim().toLowerCase() ===
         "currently unavailable";

      const images =
         $("#imgBlkFront").attr("data-a-dynamic-image") ||
         $("#landingImage").attr("data-a-dynamic-image") ||
         "{}";

      const imageUrls = Object.keys(JSON.parse(images));

      const currency = extractCurrency($(".a-price-symbol"));

      console.log("title : ", title);
      console.log("current price : ", currentPrice);
      console.log("original price : ", originalPrice);
      console.log("out of stock", outOfStock);
      console.log("image", imageUrls);
      console.log("currency", currency);
   } catch (error: any) {
      throw new Error(`Failed to scrape product: ${error.message}`);
   }
}
