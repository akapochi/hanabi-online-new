'use strict';
const crypto = require('crypto');

const hanabiObj = {
  otherHanabiMap: new Map()
};

const gameObj = {
  playersMap: new Map()
}

function newConnection(socketId) {
  const playerId = crypto.createHash('sha1').update(socketId).digest('hex'); // プレイヤーのID を socketId からハッシュ値を計算して作成

  const playerObj = {
    playerId: playerId
  };
  gameObj.playersMap.set(socketId, playerObj);

  const startObj = {
    playerObj: playerObj
  };

  return startObj;
}

// 花火を打ち上げたとクライアントから通知があったときに実行する hanabiEmit 関数
function hanabiEmit(socketId, offsetX, offsetY, color) {
  console.log(`(${offsetX}, ${offsetY})で、${color}色の花火が打ちあがりました！`);
  console.log(`socketIdは${socketId}`);

  const hanabiId = Math.floor(Math.random() * 100000) + ',' + socketId

  const otherHanabiObj = {
    x: offsetX,
    y: offsetY,
    color: color,
    id: hanabiId
  };
  hanabiObj.otherHanabiMap.set(hanabiId, otherHanabiObj); // hanabiObjの中のotherHanabiMap 連想配列に追加
}

// 花火の情報を返す getHanabiData 関数
function getHanabiData() {
  const otherHanabiArray = [];
  const playersArray = [];

  for (let [id, otherHanabi] of hanabiObj.otherHanabiMap) {
    const otherHanabiDataForSend = [];

    otherHanabiDataForSend.push(otherHanabi.x);
    otherHanabiDataForSend.push(otherHanabi.y);
    otherHanabiDataForSend.push(otherHanabi.color);
    // otherHanabiDataForSend.push(otherHanabi.id);

    otherHanabiArray.push(otherHanabiDataForSend);
  }

  for (let [socketId, plyer] of gameObj.playersMap) {
    const playerDataForSend = [];

    playerDataForSend.push(plyer.playerId);

    playersArray.push(playerDataForSend);
  }


  return [otherHanabiArray, playersArray];
}

function deleteHanabi(hanabiId) {
  hanabiObj.otherHanabiMap.delete(hanabiId);
}

// 接続が切れた時は離脱したと判断し playersMap からプレイヤーデータを削除
function disconnect(socketId) {
  gameObj.playersMap.delete(socketId);
}

module.exports = {
  newConnection,
  hanabiEmit,
  getHanabiData,
  deleteHanabi,
  disconnect
}