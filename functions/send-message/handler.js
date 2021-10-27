'use strict'
const zb = require("zeebe-node");
const uuid = require("uuid");



module.exports = async (event, context) => {
  const result = {
    'body': JSON.stringify(event.body),
    'content-type': event.headers["content-type"]
  }

  const { username, password } = event.headers

  console.log(`User and ${username}  ${password}`)

  const method = event.method;

  console.log(event.body)

  return context.succeed(event.body)
  const { payload } = event.body
  console.log(`Payload ${JSON.stringify(payload.id)}`)

  /**
   * Only POST requests
   */
  switch (method) {
    case 'POST':
      const workflow_id = payload.id

      const { message_name } = payload;

      const zbc = new zb.ZBClient('https://api.camunda.cloud.angelalvaradohdz.me', { "basicAuth": { username: username, password: password }, useTLS: false }, { loglevel: 'INFO' });

      //let variables = payload
      console.log(workflow_id)
      //variables.status = 'PROCESSED'
      const res = await zbc.publishMessage({
        correlationKey: workflow_id,
        messageId: uuid.v4(),
        name: message_name,
        //variables: variables,
        timeToLive: zb.Duration.seconds.of(1), // seconds
      });

      return context.succeed({ success: true, result: res });
    default:
      return context.status(405).succeed({ succes: false });
  }
}
