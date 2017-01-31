'use strict';

var le = require('greenlock-express').create({
  // in production use https://acme-v01.api.letsencrypt.org/directory
  server: 'staging',
  configDir: require('os').homedir() + '/letsencrypt/etc',
  
  // approveDomains: function (opts, certs, cb) {
  //   opts.domains = certs && certs.altnames || opts.domains;
  //   opts.email = 'niels@postplanner.com' // CHANGE ME
  //   opts.agreeTos = true;
  // 
  //   cb(null, { options: opts, certs: certs });
  // },
  email: 'niels@postplanner.com',
  agreeTos: true,
  approveDomains: ['hapi-letsencrypt.dev'],
  
  challenges: { 
    'http-01': require('le-challenge-fs').create({
      webrootPath: '/tmp/acme-challenges'
    })
  },
  store: require('le-store-certbot').create({
    webrootPath: '/tmp/acme-challenges'
  }),
  
  debug: true
});

module.exports = le;