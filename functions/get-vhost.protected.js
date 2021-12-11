exports.handler = function (context, event, callback) {
  const phoneNumber = event.To.substring(2);
  const client = context.getTwilioClient();

  client.incomingPhoneNumbers.list(
    {
      phoneNumber: phoneNumber,
    },
    (err, data) => {
      if (err) {
        return callback(err);
      }
      console.log('data = ' + data);
      var fName;
      if (data.length) {
        fName = data[0].friendlyName;
      } else {
        fName = phoneNumber;
      }
      const response = { FriendlyName: fName };
      callback(null, response);
    }
  );
};
