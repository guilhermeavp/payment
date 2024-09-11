import { server as HapiServer } from '@hapi/hapi';
import Consul from 'consul';
import { randomUUID } from 'crypto';
import { PaymentDto } from './command/payment-dto';
import { Servico } from './servico';

const consul = new Consul({
  host:'consul1'
});
const consulId = randomUUID();

const init = async () => {

  const servico = new Servico();

  const server = HapiServer();

  server.route({
    method: 'GET',
    path: '/',
    handler: (_, reply) => reply.response('').code(200)
  });

  server.route({
    method: 'POST',
    path: '/api/',
    handler: req => servico.payment(req.payload as PaymentDto)
  });

  await server.start();
  console.log('Payment iniciado em %s', server.info.uri);
  consul.watch({
    method: consul.health.service,
    options: ({
      service: 'payment',
      passing: true
    } as any)
  });
  console.log('server.info.uri',server.info.uri);
  const opts: Consul.Agent.Service.RegisterOptions = {
    name: 'payment',
    address: server.info.host,
    port: server.info.port as number,
    id: consulId,
    check: {
      http: server.info.uri,
      interval: '5s'
    }
  };

  await consul.agent.service.register(opts);
};

async function signalHandler() {
  await consul.agent.service.deregister({ id: consulId });
  console.log('Removido do consul');
  process.exit();
}

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);
process.on('SIGQUIT', signalHandler);

init();