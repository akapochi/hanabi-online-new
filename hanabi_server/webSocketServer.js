function createWebSocketServer(io, hanabi) {

  const rootIo = io.of('/');
  rootIo.on('connection', (socket) => {

    const displayName = socket.handshake.query.displayName;
    const thumbUrl = socket.handshake.query.thumbUrl;

    const startObj = hanabi.newConnection(socket.id); // game.newConnection はプレイヤーが新たにゲームに参加した時実行する関数
    console.log('WebSocket のコネクションがありました。');
    socket.emit('start data', startObj);
    console.log(`${startObj}を送りました`)

    socket.on('hanabi emit', (offsetX, offsetY, color, hanabiId) => {
      hanabi.hanabiEmit(socket.id, offsetX, offsetY, color);
      rootIo.volatile.emit('hanabi data', hanabi.getHanabiData()); // 全員に送信
      hanabi.deleteHanabi(hanabiId);
    })

    socket.on('disconnect', () => {
      // プレイヤーが接続を切断した時に実行される処理
      hanabi.disconnect(socket.id); // hanabi.disconnect はプレイヤーが接続を切った時に実行する関数
    });
  });

  // const socketTicker = setInterval(() => {
  //   rootIo.volatile.emit('hanabi data', hanabi.getHanabiData()); // 全員に送信
  // },
  //   66);
}

module.exports = {
  createWebSocketServer
};