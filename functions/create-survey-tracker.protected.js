exports.handler = async (context, event, callback) => {
  console.log('CREATE IVR - CALL SID: ', event.callSid, event.from);

  let from_number = event.from;

  let client = context.getTwilioClient();

  let conversations = {};
  conversations.conversation_id = event.callSid;

  try {
    const response = await client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .tasks.create({
        attributes: JSON.stringify({ from: from_number, conversations }),
        workflowSid: context.TWILIO_NOBODY_WORKFLOW_SID,
        timeout: 300,
      });
    return callback(null, response.sid);
  } catch (error) {
    return callback(`Error -- Survey Task Not Created: ${error}`);
  }
};
