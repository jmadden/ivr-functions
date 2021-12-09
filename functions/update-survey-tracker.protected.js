exports.handler = async (context, event, callback) => {
  let digits = event.digits;

  let client = context.getTwilioClient();

  let taskFilter = `callSurvey == '${event.callSid}'`;

  //search for the task based on the CallSid attribute
  const tasks = client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks.list({ evaluateTaskAttributes: taskFilter })
    .then((tasks) => {
      console.log(tasks);
      let taskSid = tasks[0].sid;
      let attributes = { ...JSON.parse(tasks[0].attributes) };
      let IVR_time = Math.round(
        (IVR_end - attributes.conversations.IVR_time_start) / 1000
      );

      //was the call abandoned?
      if (callStatus == 'completed') {
        attributes.conversations.abandoned = 'Yes';
        attributes.conversations.abandoned_phase = 'Survey';
      } else {
        attributes.conversations.abandoned = 'No';
        attributes.conversations.abandoned_phase = null;
      }

      //update the task
      client.taskrouter
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .tasks(taskSid)
        .update({
          assignmentStatus: 'canceled',
          reason: 'IVR task',
          attributes: JSON.stringify(attributes),
        })
        .then((task) => {
          callback();
        })
        .catch((error) => {
          console.log(error);
          callback(error);
        });
    })
    .catch((error) => {
      console.log(error);
      callback(error);
    });
};
