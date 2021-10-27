'use strict'
const zb = require("zeebe-node");
const uuid = require("uuid");

module.exports = async (event, context) => {
  /*const result = {
    'body': JSON.stringify(event.data),
    'content-type': event.headers["content-type"]
  }*/

  console.log(event.body)

  const { username, password } = event.headers

  console.log(`User and ${username}  ${password}`)

  const method = event.method;
  //const { data, zeebe_credentials } = event.body
  const payload = event.body

  console.log(JSON.stringify(payload))

  //return context.status(200).succeed(payload)

  console.log(`Payload ${JSON.stringify(payload.id)}`)
  /**
   * Only POST requests
   */
  switch (method) {
    case 'POST':

      const zbc = new zb.ZBClient('https://api.camunda.cloud.angelalvaradohdz.me', { "basicAuth": { username: username, password: password }, useTLS: false }, { loglevel: 'INFO' });
      //const orderid = uuid.v4()

      // DECLARATION OF ANY PROCESS:

      zbc.createWorker(
        {
          taskType: 'actiivty-task',
          taskHandler: job => {
            const { key, variables } = job;
            console.info(`* Starting Activity...: ${variables}`);
            //const stock = 100; //Aqui se revisa el stock con una request
            job.complete({ variables: variables, sucess: true });
            console.info(`* Passing to next task: ${variables}`);
          }
        });

      //const newsbc = zbc.createBatchWorker(zbc);
      const wfi = await zbc.createProcessInstance("single-process", { workflow_id: payload.id });
      //wfi.orderid = orderid;
      return context.succeed({ res: payload, wfi });
      break;
    default:
      return context.status(405).succeed({ message: "Only POST" });
      break;
  }
}
