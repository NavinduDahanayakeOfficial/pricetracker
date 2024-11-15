import { PriceHistoryItem } from "@/types";

const Notification = {
   WELCOME: "WELCOME",
   CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
   LOWEST__PRICE: "LOWEST_PRICE",
   THRESHOLD_MET: "THRESHOLD_MET",
};

const THRESHOLD_PERCENTAGE = 40;

export function extractPrice(...elements: any) {
   for (const element of elements) {
      const offscreenPrice = element.find(".a-offscreen").first().text().trim();
      if (offscreenPrice) {
         return cleanPrice(offscreenPrice);
      }

      // Handle cases where price is directly in the element
      const priceText = element.first().text().trim();
      if (priceText) {
         return cleanPrice(priceText);
      }
   }
}

function cleanPrice(priceText: any) {
   const cleanPrice = priceText.replace(/[^\d.]/g, "");
   let firstPrice;
   if (cleanPrice) firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];

   return firstPrice || cleanPrice;
}

export function extractCurrency(element: any) {
   const currencyText = element.text().trim().slice(0, 1);
   return currencyText;
}

export function extractDescription($: any) {
   const selectors = ["#featurebullets_feature_div #feature-bullets ul"];

   for (const selector of selectors) {
      const elements = $(selector);

      if (elements.length > 0) {
         const textContent = elements
            .map((_: any, element: any) => $(element).text().trim())
            .get()
            .join("\n");

         return textContent;
      }
   }
   return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
   let highestPrice = priceList[0];

   for (let i = 0; i < priceList.length; i++) {
      if (priceList[i].price > highestPrice.price) {
         highestPrice = priceList[i];
      }
   }

   return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
   let lowestPrice = priceList[1];

   for (let i = 0; i < priceList.length; i++) {
      if (priceList[i].price < lowestPrice.price) {
         lowestPrice = priceList[i];
      }
   }

   return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
   const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);

   return sumOfPrices / priceList.length || 0;
}

export const formatNumber = (num: number = 0) => {
   return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   });
};
