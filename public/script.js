const list = document.getElementById('list');
const form = document.getElementById('createMsg');
const status = document.getElementById('status');
const pageChat = document.getElementById('pageChat');
const btn = document.getElementById('button');
const writeText = document.getElementById('writeText');
const userName = document.getElementById('name');
const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const msPerMin = 60 * 1000;

const socket = io();

let newItems = [];
let messages = [];

function printMessage(value) {
  const li = document.createElement('li');
  const time = document.createElement('span');
  const del = document.createElement('div');
  const div = document.createElement('div');
  const msg = document.createElement('p');

  time.classList.add('time');
  del.classList.add('del');
  div.classList.add('div');
  time.textContent = 'только что';
  msg.innerHTML = `${value.name.bold()}: ${value.message}`;

  li.appendChild(msg);
  li.appendChild(div);
  list.appendChild(li);

  if(value.id == socket.id) {
    div.appendChild(time);
    li.classList.add('me');
    div.appendChild(del);

  } else if(value.id == 'chat_bot') {
    li.classList.add('chat_bot')

  } else {
    div.appendChild(time);
    li.classList.add('not_me')
  }

  time.created = new Date();

  newItems.push(time);
  messages.push(li);

  list.lastChild.scrollIntoView(false);

  del.addEventListener('click', e => {
    let msgId = messages[messages.indexOf(li)];
    msgId.remove();
  })

  btn.disabled = true;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  socket.emit('chat', {name: userName.value, message: writeText.value, id: socket.id});
  writeText.value = '';
})

writeText.addEventListener('input', (e) => {
  if (writeText.value !== '') {
    btn.disabled = false;
  };
})

setInterval(() => {
  const currentDate = new Date();

  for (let i = 0; i < newItems.length; i++) {
    const time = newItems[i];
    const timeDiff = currentDate - time.created;

    let currentMonth = time.created.getMonth();

    if (timeDiff < msPerMin) {
      time.textContent = `${Math.round(timeDiff / 1000)} сек назад`;
    } else {
      time.textContent = time.created.getDate() + ' ' +
                        month[currentMonth] + ' в ' +
                        time.created.getHours() + ':' +
                        time.created.getMinutes();
      
      delete time.created;
    }
  }

  newItems = newItems.filter(time => time.created);
}, 5000);

function setStatus(value) {
  status.innerHTML = value;
}

socket.on('crowded', (message) => {
  setStatus('offline');
  printMessage(message);
})

socket.on('connect', () => {
  setStatus('online');
});

socket.on('userConnected', (message) => printMessage(message));
socket.on('userDisconnected', (message) => printMessage(message));

socket.on('chat', message => {
  printMessage(message);
});

socket.on('ready', message => printMessage(message));
