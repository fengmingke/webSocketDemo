const fileCache = require('think-cache-file');
const nunjucks = require('think-view-nunjucks');
const fileSession = require('think-session-file');
const mysql = require('think-model-mysql');
const socketio = require('think-websocket-socket.io');
// const redis = require('socket.io-redis');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: '',
    prefix: 'think_',
    encoding: 'utf8',
    host: '127.0.0.1',
    port: '',
    user: 'root',
    password: 'root',
    connectionLimit: 1, // 连接池的连接个数，默认为 1
    pageSize: 20, // 设置默认每页为 20 条
    dateStrings: true
  },
  mongo: {
    host: '127.0.0.1', // 可以支持多个host ['127.0.0.1', '10.16.1.2']
    port: 27017, // 可以支持多个port [27017, 27018]
    user: '',
    password: '',
    database: '', // 数据库名称
    pageSize: 20 // 设置默认每页为 20 条
    // options: {
    //   replicaSet: 'mgset-3074013',
    //   authSource: 'admin'
    // }
  }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs'
      // keys: ['werwer', 'werwer'],
      // signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks,
    // beforeRender: () => {}, // 模板渲染预处理
    beforeRender(env, nunjucks, config) { // 模板渲染预处理
      // env.addFilter('utc', time => (new Date(time)).toUTCString());
    },
    options: { // 模板引擎额外的配置参数
      autoescape: true
      // tags: { // 修改定界符相关的参数
      //   blockStart: '<%',
      //   blockEnd: '%>',
      //   variableStart: '<$',
      //   variableEnd: '$>',
      //   commentStart: '<#',
      //   commentEnd: '#>'
      // }
    }
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};

exports.websocket = {
  type: 'socketio',
  common: {
    // common config
  },
  socketio: {
    handle: socketio,
    // allowOrigin: '127.0.0.1:8361', // 默认所有的域名都允许访问 http://www.coolnodejs.com/
    path: '/socket.io', // 默认 '/socket.io'
    adapter: null, // 默认无 adapter
    // adapter: redis({ host: 'localhost', port: 6379 }),
    messages: [{
      open: '/websocket/open', // 建立连接时处理对应到 websocket Controller 下的 open Action
      close: '/websocket/close', // 关闭连接时处理的 Action
      addUser: '/websocket/addUser', // addUser 事件处理的 Action
      login: '/websocket/login',
      chat: '/websocket/chat',
      logout: '/websocket/logout'
    }]
  }
};
