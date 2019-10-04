let socket = null;

export default {
  tileSelected(context, payload) {
    context.commit('tileSelected', payload);
  },

  tileUnselected(context, payload) {
    context.commit('tileUnselected', payload);
  },

  // https://dev.to/aduranil/how-to-use-websockets-with-redux-a-step-by-step-guide-to-writing-understanding-connecting-socket-middleware-to-your-project-km3
  openWebsocket(context, payload) {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = (e) => {
      console.log('websocket opened');
      socket.send(JSON.stringify({ event: 'register', player: payload }));
    };

    socket.onmessage = (ev) => {
      console.log('onmessage');
      console.log(ev.data);
    };
  },

  updatePlayer(context, payload) {
    console.log('send player update', payload);
    socket.send(JSON.stringify({
      event: 'updatePlayer',
      player: payload
    }));
  }
}
