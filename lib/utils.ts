export function extractPrice(...elements: any) {
   for (const element of elements) {
      const offscreenPrice = element.find(".a-offscreen").first().text().trim();
      if (offscreenPrice) {
         return offscreenPrice.replace(/[^\d.]/g, "");
      }

      // Handle cases where price is directly in the element
      const priceText = element.first().text().trim();
      if (priceText) {
         return priceText.replace(/[^\d.]/g, "");
      }
   }
}

export function extractCurrency(element: any) {
   const currencyText = element.text().trim().slice(0, 1);
   return currencyText;
}
