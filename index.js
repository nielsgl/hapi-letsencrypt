'use strict';

const Hapi = require('hapi');
// const fs = require('fs');
const CreateServer = require('auto-sni');
const Chalk = require('chalk');
// const Https = require('spdy')
// const GreenLock = require('./greenlock');

const server = new Hapi.Server();

// const acmeResponser = GreenLock.middleware();
// const httpsServer = Https.createServer(GreenLock.httpsOptions).listen(8081);

// var tls = {
//   key: fs.readFileSync('./key.txt'),
//   cert: fs.readFileSync('./crt.txt')
// };






// server.connection({
//   listener: httpsServer,
//   autoListen: false,
//   tls: true
// })
// 
// server.route({
//   method: 'GET',
//   path: '/.well-known/acme-challenge',
//   handler: function (request, reply) {
//     var req = request.raw.req;
//     var res = request.raw.res;
// 
//     reply.close(false);
//     acmeResponder(req, res);
//   }
// });


const secureServer = CreateServer({
  email: 'niels@postplanner.com',
  agreeTos: true,
  debug: true,
  domains: ['hapi-letsencrypt.dev'],
  forceSSL: true,
  redirectCode: 301,
  ports: {
    http: 8080,
    https: 8081
  }
})

server.connection({
  host: 'hapi-letsencrypt.dev',
  listener: secureServer,
  autoListen: false,
  tls: true
});

const options = {
    ops: {
        interval: 180000
    },
    reporters: {
        console: [
        {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
                ops: '*',
                request: '*',
                response: '*',
                log: '*',
                error: '*'
            }]
        },
        {
            module: 'good-console'
        },
        'stdout'
    ]
    }
};


server.on('log', (event, tags) => {
    if (tags.error) {
        console.log(`[${event.tags}], ${Chalk.red(event.data)}`);
    }
    else {
        console.log(`[${event.tags}], ${Chalk.green(event.data)}`);
    }
});

server.on('request-error', (request, err) => {
    server.log('request err', err);
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world! :D!');
    }
});


server.register({
    register: require('good'),
    options,
  }, (err) => {
    if (err) {
      return console.error(err);
    }
    
    server.start(() => {
        console.info(`Server started at ${ server.info.uri }`);
    });
});