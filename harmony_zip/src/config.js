// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: true,
    
    saveUserOnResponseEnabled: true,
    userDataCol: 'userData',

    user: {
        metaData: {
            enabled: true,
        },
    },

    intentMap: {
       'AMAZON.StopIntent': 'END',
       'AMAZON.CancelIntent': 'END'
    },
 
    db: {
         FileDb: {
             pathToFile: '../db/db.json',
         },
         DynamoDb: {
             tableName: "HarmonyAA-table",
         }
     },
 };
 