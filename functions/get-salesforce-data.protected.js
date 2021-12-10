exports.handler = function (context, event, callback) {
  const jsforce = require('jsforce');
  const salesforceUserName = context.SALESFORCE_USERNAME;
  const salesforcePassword = context.SALESFORCE_PASSWORD;
  const phoneNumber = event.To;

  var callbackResponse = {
    priority: false,
    url: 'no url found',
  };
  //connect to the test sandbox, you can remove the login url for production
  var conn = new jsforce.Connection({
    loginUrl: 'https://test.salesforce.com',
  });
  conn.login(salesforceUserName, salesforcePassword, function (err, res) {
    if (err) {
      return console.error(err);
    }
    conn.search(
      'FIND {' +
        phoneNumber +
        '} IN ALL FIELDS RETURNING MCC_Phone_Number__c( Id, Phone__c, Value__c) LIMIT 1',
      function (err, res) {
        if (err) {
          callback(null, callbackResponse);
        }
        valuePlusId = res.searchRecords[0].Value__c;
        conn.query(
          "SELECT Id, Priority__c, Contact_Center_Matrix__c, Database_URL__c FROM ValuePlus__c WHERE Id = '" +
            valuePlusId +
            "' LIMIT 1",
          function (err, result) {
            if (err) {
              return console.error(err);
            }
            var returnUrl = '';
            if (result.records[0].Contact_Center_Matrix__c !== null) {
              returnUrl = result.records[0].Contact_Center_Matrix__c;
            } else {
              returnUrl = result.records[0].Database_URL__c.split('"')[1];
            }

            callbackResponse = {
              priority: result.records[0].Priority__c,
              url: returnUrl,
            };
            callback(null, callbackResponse);
          }
        );
      }
    );
  });
};
