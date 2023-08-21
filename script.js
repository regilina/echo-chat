const wsUrl = 'wss://echo-ws-service.herokuapp.com'

const output = document.getElementById('output')
const btnSend = document.querySelector('.j-btn-send')
const input = document.getElementById('message-input')
const locationButton = document.querySelector('.j-btn-location')

let websocket

function writeToScreen (message, isSent = false) {
  const pre = document.createElement('p')
  pre.style.wordWrap = 'break-word'
  pre.innerHTML = message
  if (isSent) {
    pre.classList.add('sent-message')
  } else {
    pre.classList.add('response-message')
  }
  output.appendChild(pre)
}

function openWebsocket () {
  websocket = new WebSocket(wsUrl)
  websocket.onclose = function (evt) {
    writeToScreen('DISCONNECTED')
  }
  websocket.onmessage = function (evt) {
    writeToScreen(evt.data)
  }
  websocket.onerror = function (evt) {
    writeToScreen(
      '<span style="color: red;">ERROR:</span> ' + evt.data
    )
  }
}

function closeWebsocket () {
  websocket.close()
  websocket = null
}

function getLocation () {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      const locationURL = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
      writeToScreen(`<a href="${locationURL}" target="_blank">Моя геолокация</a>`, true)
    })
  } else {
    alert('Геолокация недоступна.')
  }
}

window.addEventListener('beforeunload', () => {
  if (websocket) {
    closeWebsocket()
  }
})

btnSend.addEventListener('click', () => {
  const message = input.value.trim()
  if (message !== '') {
    writeToScreen(message, true)
    websocket.send(message)
    input.value = ''
  }
})

locationButton.addEventListener('click', () => {
  getLocation()
})

openWebsocket()
