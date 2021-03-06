const open = document.getElementById('open');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');

const qrcodeContainer = document.getElementById("qrcode");
const shop_key = "6282df8e1da8f62e747ef3b0"; //shop coto

open.addEventListener('click', () => {
  connect_client(uniqueId());
});

close.addEventListener('click', () => {
  modal_container.classList.remove('show');
});



function generateQRCode(unique_key) {
  qrcodeContainer.innerHTML = "";
  new QRCode(qrcodeContainer, {
    text: unique_key,
    width: 350,
    height: 350,
    colorDark: "#1A1A22",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
  document.getElementById("qrcode-container").style.display = "block";
  modal_container.classList.add('show');  
}

function connect_client(qr_key) {
  var connection = new WebSocket(`ws://${location.host}?device=web&room=${qr_key}`);
  connection.onopen = function(ws, req) {
    generateQRCode(qr_key)
    connection.onmessage = function(mes) {
      try {
        console.log(mes.data)
        const parsed = JSON.parse(mes.data);
        switch (parsed["msg"]) {
          case "scanned":
            fetch('example.json').then(response =>  response.json()).then(cart =>{ 
              connection.send(JSON.stringify({
                "msg": "cart",
                "shop_key": shop_key,
                "cart": cart
              }))
            })
            break; 
          case "pucharsed":
            modal_container.classList.remove('show');
            alert('MUITU BRIGADO POR SU COMPRA MANITO VOCE E UM AMIGO')
            break
        }
      } catch (err) {}
    };
  };
}

function uniqueId() {
  var unique = '';
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 25; i++) {
    unique += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return unique;
}