const fs = require('fs');

// Load your JSON file
const inputFile = 'sample-notification.json'; // Change this to your input file name
const outputFilePrefix = 'output'; // Change this to your desired output file prefix
const n = 500; // Change this to the number of items per file
const threshold = [{
    "thresholdValue": 99999,
    "domain": 1,
    "csvType": 18,
    "isDrop": true,
}, {
    "thresholdValue": 0,
    "domain": 1,
    "csvType": 18,
    "isDrop": false,
}];

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading JSON file: ${err}`);
    return;
  }

  try {
    const dataObj = JSON.parse(data);
    const dataArray = dataObj.trackings;

    const outputFiles = [];

    //restructure existing array
    for (let j = 0; j < dataArray.length; j++) {
        const product = dataArray[j];

        //replace thresholdValues with the new values
        product.thresholdValues = threshold;
        product.updateInterval = 24;
        product.desiredPricesInMainCurrency = true;
  
        delete product.createDate;
        delete product.notificationCSV;
        delete product.couponCSV;
        delete product.trackingListName;
        delete product.lightningDealsAlerts;
        delete product.wishListId;
        delete product.wishListItemId;
        delete product.isActive;
        delete product.notifyIf;
        delete product.notificationType;
      }

    for (let i = 0; i < dataArray.length; i += n) {
      const chunk = dataArray.slice(i, i + n);
      const outputFileName = `${outputFilePrefix}_${i / n + 1}.json`;
      console.log('outputfile', outputFileName)
      fs.writeFileSync(outputFileName, JSON.stringify(chunk, null, 2));

      outputFiles.push(outputFileName);
      console.log(`Created ${outputFileName}`);
    }

    console.log('Created the following output files:');
    console.log(outputFiles);
  } catch (error) {
    console.error(`Error parsing JSON data: ${error}`);
  }
});