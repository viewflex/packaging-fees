import { additionalFees } from "@wix/ecom/service-plugins";
import * as wixData from '@wix/data';

additionalFees.provideHandlers({
  calculateAdditionalFees: async (payload) => {
    const { request, metadata } = payload;
    // Use the `request` and `metadata` received from Wix and apply custom logic.

    const packagingFeesConfig = await getPackagingFeesConfig();
    console.log('packagingFeesConfig');
    console.log(packagingFeesConfig);

    let lineItems = request.lineItems;
    let additionalFees = [];
    let packagingFeesTotal = 0;

    if ((packagingFeesConfig !== null) && (packagingFeesConfig.amount > 0) && (lineItems !== undefined) && (lineItems.length > 0)) {
      packagingFeesTotal = packagingFeesConfig.perItem ? packagingFeesConfig.amount * lineItems.length : packagingFeesConfig.amount;
    }

    if (packagingFeesTotal > 0) {
      additionalFees.push({
        code: "packaging-fees",
        name: "Packaging Fees",
        price: String(packagingFeesTotal),
        taxDetails: {
          taxable: true,
        },
      });
    }

    return {
      additionalFees: additionalFees,
      currency: packagingFeesConfig !== null ? packagingFeesConfig.currency : 'USD'
    };
  },
});

async function getPackagingFeesConfig() {

  return wixData.items.query("PackagingFeesConfig")
      .find()
      .then((results) => {
        if (results.items.length > 0) {
          const item = results.items[0]; // Assuming there is only one item

          return {
            amount: <number> item.amount,
            currency: <string> item.currency,
            perItem: <boolean> item.perItem
          };

        } else {
          console.log("No items found in the collection.");
          return null;
        }
      })
      .catch((error) => {
        console.error("Error querying collection:", error);
        return null;
      });
}