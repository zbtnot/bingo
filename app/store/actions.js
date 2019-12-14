let socket = null;

export default {
  changePage(context, newPage) {
    context.commit("setCurrentPage", newPage);
  },

  tileSelected(context, payload) {
    context.commit("pushTileToSelectedList", payload);
  },

  tileUnselected(context, payload) {
    context.commit("popTileFromSelectedList", payload);
  },

  setPlayerName(context, playerName) {
    context.commit("setPlayerName", playerName);
  },

  setPlayerTiles(context, tiles) {
    context.commit("setPlayerTiles", tiles);
  },

  // https://dev.to/aduranil/how-to-use-websockets-with-redux-a-step-by-step-guide-to-writing-understanding-connecting-socket-middleware-to-your-project-km3
  openWebsocket(context, payload) {
    socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(JSON.stringify({ event: "register", player: payload }));
    };

    socket.onmessage = ev => {
      const data = JSON.parse(ev.data);
      const players = data.data;

      if (players.length) {
        context.commit("updatePlayers", players);
      }
    };
  },

  updatePlayer(context, payload) {
    socket.send(
      JSON.stringify({
        event: "updatePlayer",
        player: payload
      })
    );
  }
};
