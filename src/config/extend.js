const view = require('think-view');
const model = require('think-model');
const mongo = require('think-mongo');
const cache = require('think-cache');
const session = require('think-session');
const websocket = require('think-websocket');
const fetch = require('think-fetch');

module.exports = [
  fetch, // HTTP request client.
  view, // make application support view
  model(think.app),
  mongo(think.app), // 让框架支持模型的功能
  cache,
  session,
  websocket(think.app)
];
