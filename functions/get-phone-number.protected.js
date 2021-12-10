exports.handler = async (context, event, callback) => {
  // Retrieve list of phone numbers in Assets.
  const openFile = await Runtime.getAssets()[context.PHONE_LIST_URL].open;
  const getNumber = async (phoneCalled) => {
    return new Promise((resolve, reject) => {
      const text = openFile();
      const numObj = JSON.parse(text);
      console.log('NUMBER OBJ: ', numObj);
      const forwardNumber = numObj[phoneCalled];
      console.log('FORWARD NUMBER: ', forwardNumber);
      resolve(forwardNumber);
    });
  };

  const response = { forward: await getNumber(event.phone) };

  return callback(null, response);
};
