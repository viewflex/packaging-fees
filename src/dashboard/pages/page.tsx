import React, { type FC } from 'react';
import { dashboard } from '@wix/dashboard';
import { Button, Page, WixDesignSystemProvider } from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { collections, items } from '@wix/data';

let packagingFeesConfig: null|Object = null;
const collectionId: string = 'PackagingFeesConfig';
const collectionDisplayName: string = 'Packaging Fees Config';

// Defaults
let amount: number = 5.00;
let currency: string = 'USD';
let perItem: boolean = false;

async function getPackagingFeesConfig(collectionId: string) {

    return items.query(collectionId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const item = results.items[0];

                return {
                    amount: item.amount,
                    currency: item.currency,
                    perItem: item.perItem
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

async function createNewCollection(collectionId: string, collectionDisplayName: string) {
    try {
        const collection = await collections.createDataCollection({
            // @ts-ignore
            _id: collectionId,
            displayName: collectionDisplayName,
            fields: [
                {
                    key: "amount",
                    type: "NUMBER",
                    numberRange: {
                        max: 10000
                    },
                    displayName: "Amount"
                },
                {
                    key: "currency",
                    type: "TEXT",
                    stringLengthRange: {
                        maxLength: 3
                    },
                    displayName: "Currency"
                },
                {
                    key: "perItem",
                    type: "BOOLEAN",
                    displayName: "Per Item"
                }
            ],
            permissions: {
                insert: 'ADMIN',
                update: 'ADMIN',
                remove: 'ADMIN',
                read: 'ANYONE'
            }
        });

        setTimeout(function(){
            const record = {
                "amount": amount,
                "currency": currency,
                "perItem": perItem
            };

            const result = items.insert(collectionId, record);

            setTimeout(function(){
                if (result) {
                    console.log("Record inserted successfully:", result);
                } else {
                    console.log("Failed to insert record.");
                }
            }, 1000);

        }, 2000);

        console.log('Collection created successfully', collection);
    } catch (error) {
        console.error('Failed to create collection:', error);
    }
}

const Index: FC = () => {
  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page>
        <Page.Header
          title="Packaging Fees"
          subtitle="Supports adding packaging fees to your store checkout."
        />
          <Page.Content>

              <Button
                  onClick={async () => {
                      packagingFeesConfig = await getPackagingFeesConfig(collectionId);
                      console.log('packagingFeesConfig');
                      console.log(packagingFeesConfig);

                      setTimeout(function(){
                          if (packagingFeesConfig === null) {
                              // Create the collection
                              console.log('creating collection...');
                              createNewCollection(collectionId, collectionDisplayName);
                              dashboard.showToast({
                                  message: 'Collection created!',
                              });
                          } else {
                              dashboard.showToast({
                                  message: 'Collection already exists.',
                              });
                          }
                      }, 2000);
                  }}
                  prefixIcon={<Icons.BoxOpen/>}
              >
                  Create the { collectionDisplayName } collection with defaults - amount: { amount }, currency: { currency }, perItem: { perItem.toString() }.
              </Button>

          </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default Index;
