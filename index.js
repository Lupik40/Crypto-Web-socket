const app = document.getElementById("app");

const socketUrl = new URL('wss://streamer.cryptocompare.com/v2?api_key=109ba6b0b42104abee2610bf225ff1645e0a29cbb95f539dd3e517fbb5159323');

let cryptoSocket = new WebSocket(socketUrl);

let btcToUsd = 0;
let ethToUsd = 0;

let btcUp = true;
let ethUp = true;

const sendMessage = {
  action: "SubAdd",
  subs: ["0~Coinbase~BTC~USD", "0~Coinbase~ETH~USD"],
};

const generateTableWithData = () =>
  `<table class="table"><tbody><tr class="${
    btcUp ? "green" : "red"
  }"><td>BTC/USD</td><td>${btcToUsd}$</td></tr><tr class="${
    ethUp ? "green" : "red"
  }"><td>ETH/USD</td><td>${ethToUsd}$</td></tr></tbody></table>`;

cryptoSocket.onopen = () => {
  cryptoSocket.send(JSON.stringify(sendMessage));
};

cryptoSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.FSYM) {
    case "BTC":
      btcUp = data.P > btcToUsd ? true : false;
      btcToUsd = data.P;
      break;
    case "ETH":
      ethUp = data.P > ethToUsd ? true : false;
      ethToUsd = data.P;
      break;
  }

  app.innerHTML = generateTableWithData();
};

cryptoSocket.onclose = (event) => {
  if (event.wasClean) {
    app.innerHTML = `[close] Connection close, code=${event.code} reason=${event.reason}`;
  } else {
    app.innerHTML = `[close] Connection close`;
  }
};

cryptoSocket.onerror = (error) => {
  app.innerHTML = `[error] ${error.message}`;
};
