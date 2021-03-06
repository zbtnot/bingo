/**
 * @param {WebSocket} client
 * @param {WebSocketClients} clients
 * @param {Map} players
 * @param {Event} ev
 */
exports.onMessage = function(client, clients, players, ev) {
  const data = JSON.parse(ev.data);

  if (data.event === "heartbeat") {
    // nothing to do, just keeping the connection alive
    return;
  }

  const userId = data.player.id;

  // cache player's state
  players.set(userId, data.player);

  // always re-add client in case we are dealing with a reconnected client
  clients.addClient(userId, client);

  switch (data.event) {
    case "register":
      // send this new player the list of all players
      sendUpdate(userId, client, players);
      break;
    default:
      break;
  }

  // send updated players list to all players
  sendUpdateToOtherPlayers(userId, clients, players);
};

/**
 * Sends an "update" event websocket message.
 * @param {number} userId
 * @param {WebSocket} client
 * @param {Map} players
 */
function sendUpdate(userId, client, players) {
  const payload = {
    event: "update",
    data: [...players.values()]
  };

  try {
    client.send(JSON.stringify(payload));
  } catch (e) {
    console.error(`Unable to send websocket "update" event for ${userId}`);
  }
}

/**
 * Sends an "update" event websocket message to all clients, except for the
 * client matching the passed userId.
 * @param {uuid} userId
 * @param {WebSocketClients} clients
 * @param {Map} players
 */
function sendUpdateToOtherPlayers(userId, clients, players) {
  for (let [id, client] of clients.getOtherClients(userId)) {
    sendUpdate(id, client, players);
  }
}
