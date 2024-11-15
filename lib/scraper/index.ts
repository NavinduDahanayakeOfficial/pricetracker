import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

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

      const notAvailableForCountry =
         $("#availability_feature_div #availability span span")
            .text()
            .trim() ===
         "This item cannot be shipped to your selected delivery location. Please choose a different delivery location.";

      if (notAvailableForCountry) {
         throw new Error("Product is not available for your country");
      }

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

      const isOutOfStock =
         $("#availability span").text().trim().toLowerCase() ===
         "currently unavailable";

      const images =
         $("#imgBlkFront").attr("data-a-dynamic-image") ||
         $("#landingImage").attr("data-a-dynamic-image") ||
         "{}";

      const imageUrls = Object.keys(JSON.parse(images));

      const currency = extractCurrency($(".a-price-symbol"));

      const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

      const description = extractDescription($);

      const reviewCount = $("#acrCustomerReviewText")
         .text()
         .trim()
         .split(" ")[0]
         .replace(/,/g, "");

      const noOfStars = $(".a-size-base .a-color-base")
         .text()
         .trim()
         .split(" ")[0];

      //construct data object with scraped information
      const data = {
         url,
         title,
         currency: currency || "$",
         image: imageUrls[0],
         currentPrice: Number(currentPrice) || Number(originalPrice),
         originalPrice: Number(originalPrice) || Number(currentPrice),
         priceHistory: [
            { price: Number(currentPrice) || Number(originalPrice) },
         ], //price history starts with the current price when its scraped,the original price is not considered in the price history
         discountRate: Number(discountRate),
         description, // not working as intended
         category: "category", //need to scrape
         reviewsCount: Number(reviewCount), //need to scrape
         stars: Number(noOfStars),
         isOutOfStock,
         lowestPrice: Number(currentPrice) || Number(originalPrice),
         highestPrice: Number(originalPrice) || Number(currentPrice),
         averagePrice: Number(currentPrice) || Number(originalPrice),
      };
      console.log(data);

      return data;
   } catch (error: any) {
      throw new Error(`Failed to scrape product: ${error.message}`);
   }
}
