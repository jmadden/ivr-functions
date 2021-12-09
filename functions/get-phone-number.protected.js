exports.handler = function (context, event, callback) {
  // Phone number passed in from Studio
  const phoneCalled = event.phone;

  // Retrieve list of phone numbers in Assets.
  const openFile = Runtime.getAssets()[context.PHONE_LIST_URL].open;
  const text = openFile();

  const numObj = JSON.parse(text);

  const response = numObj[phoneCalled];

  return callback(null, response);
};
