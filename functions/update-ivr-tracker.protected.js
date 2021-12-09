exports.handler = function (context, event, callback) {
  var IVR_end = new Date();
  let callStatus = event.callStatus;
  let digits = event.digits;

  let client = context.getTwilioClient();

  let taskFilter = `conversations.conversation_id == '${event.callSid}'`;

  //search for the task based on the CallSid attribute
  client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks.list({ evaluateTaskAttributes: taskFilter })
    .then((tasks) => {
      console.log(tasks);
      let taskSid = tasks[0].sid;
      let attributes = { ...JSON.parse(tasks[0].attributes) };
      let IVR_time = Math.round(
        (IVR_end - attributes.conversations.IVR_time_start) / 1000
      );

      attributes.conversations.queue_time = 0;

      attributes.conversations.ivr_path = digits;
      attributes.conversations.ivr_time = IVR_time;

      //was the call abandoned?
      if (callStatus == 'completed') {
        attributes.conversations.abandoned = 'Yes';
        attributes.conversations.abandoned_phase = 'IVR';
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
