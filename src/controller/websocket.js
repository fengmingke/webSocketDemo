//
const Base = require('./base.js');
const names = [];

module.exports = class extends Base {
  indexAction() {
    this.body = 'this is a websocket demo.';
  }
  // 该对象为 socket.io 的一个实例
  get io() {
    return this.ctx.app.websocket;
  }
  openAction() {
    this.emit('opend', 'This client opened successfully!');
    this.broadcast('joined', 'There is a new client joined successfully!');
    // return this.success();
  }
  closeAction() {
    // console.log(this.websocket.socket_name);
    // console.log('ws close');
    const name = this.websocket.socket_name;
    for (let i = 0; i < names.length; i++) {
      if (names[i] === name) {
        names.splice(i, 1);
        break;
      }
    }
    // return this.success();
  }
  addUserAction() {
    // return this.success();
  }
  loginAction() {
    // console.log('获取客户端 login 事件发送的数据', this.wsData);
    // console.log(this.websocket.broadcast.emit);
    // console.log('获取当前 WebSocket 对象', this.websocket);
    // console.log('判断当前请求是否是 WebSocket 请求', this.isWebsocket);
    this.websocket.socket_name = this.wsData;
    // console.log(this.websocket.socket_name);
    const name = this.wsData;
    for (let i = 0; i < names.length; i++) {
      if (names[i] === name) {
        // this.websocket.emit('duplicate');
        this.websocket.send('duplicate'); // 先发送此消息，再执行下行代码，解决通知到其它socket连接点的bug
        this.emit('duplicate'); // 先执行上行代码，这样才能解决发送的是当前socket连接点
        return;
      }
    }
    names.push(name);
    // this.io.sockets.emit('login', name);
    // this.broadcast('login', name);
    this.websocket.broadcast.emit('login', name);
    // this.io.sockets.emit('sendClients', names);
    this.broadcast('sendClients', names);
  }
  chatAction() {
    // console.log('chatAction = ' + this.wsData);
    // this.io.sockets.emit('chat', this.wsData);
    this.broadcast('chat', this.wsData);
  }
  logoutAction() {
    // console.log('logoutAction = ' + this.wsData);
    const name = this.wsData;
    for (let i = 0; i < names.length; i++) {
      if (names[i] === name) {
        names.splice(i, 1);
        break;
      }
    }
    // socket.broadcast.emit('logout', name);
    this.websocket.broadcast.emit('logout', name);
    // this.io.sockets.emit('sendClients', names);
    this.broadcast('sendClients', names);
  }
};
