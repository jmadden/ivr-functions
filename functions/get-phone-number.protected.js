exports.handler = async (context, event, callback) => {
  // Retrieve list of phone numbers in Assets.
  const openFile = await Runtime.getAssets()[context.PHONE_LIST_URL].open;
  console.log('PHONE CALLED: ', event.phone);
  const getNumber = async (phoneCalled) => {
    const text = openFile();
    const numObj = JSON.parse(text);
    console.log('NUMBER OBJ: ', numObj);
    const forwardNumber = numObj[phoneCalled]
      ? numObj[phoneCalled]
      : 'Number not found';
    console.log('FORWARD NUMBER: ', forwardNumber);
    return new Promise((resolve, reject) => {
      resolve(forwardNumber);
    });
  };

  const response = { forward: await getNumber(event.phone) };

  return callback(null, response);
};
