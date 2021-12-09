exports.handler = async (context, event, callback) => {
  const client = context.getTwilioClient();
  const attributes = {
    callSurvey: event.callSid,
    conversations: { conversation_id: event.callSid },
  };
  try {
    const response = await client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .tasks.create({
        attributes: JSON.stringify(attributes),
        workflowSid: context.TWILIO_NOBODY_WORKFLOW_SID,
        timeout: 300,
      });
    return callback();
  } catch (error) {
    return callback(`Error -- Survey Task Not Created: ${error}`);
  }
};
