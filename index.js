'use strict';

const Hapi = require('hapi');
// const CreateServer = require('auto-sni');
const Chalk = require('chalk');

const server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: 8080
})


// const secureServer = CreateServer({
//   email: 'niels@postplanner.com',
//   agreeTos: true,
//   debug: true,
//   domains: ['localhost', 'hapi-letsencrypt.dev', 'shinra.home'],
//   forceSSL: true,
//   redirectCode: 301,
//   ports: {
//     http: 8080,
//     https: 8081
//   }
// })
// 
// server.connection({
//   listener: secureServer,
//   autoListen: false,
//   tls: true
// });
// 
// console.log(server.connection);

const options = {
    ops: {
        interval: 60000
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