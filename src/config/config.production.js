// production config, it will load in production enviroment
module.exports = {
  startServerTimeout: 5000, // 将超时时间改为 5s
  workers: 0, // 可以根据实际情况修改，0 为 cpu 的个数
  host: '127.0.0.1', // websocket.coolnodejs.com | 120.79.43.145 | 127.0.0.1
  port: 8361,
  stickyCluster: true
};
