exports.handler = function (context, event, callback) {
  console.log('CREATE IVR - CALL SID: ', event.callSid, event.from);

  var timestamp = new Date();
  let from_number = event.from;

  let client = context.getTwilioClient();

  let conversations = {};
  conversations.conversation_id = event.callSid;
  conversations.virtual = 'Yes';
  conversations.abandoned = 'Yes';
  conversations.abandoned_phase = 'IVR';
  conversations.communication_channel = 'IVR';
  conversations.IVR_time_start = timestamp.getTime();

  client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks.create({
      attributes: JSON.stringify({ from: from_number, conversations }),
      workflowSid: context.TWILIO_NOBODY_WORKFLOW_SID,
      timeout: 300,
    })
    .then(() => {
      callback();
    });
};
