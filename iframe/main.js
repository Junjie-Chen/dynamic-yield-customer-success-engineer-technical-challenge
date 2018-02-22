var content = document.getElementsByClassName('content')[0];
var input = document.getElementById('message');
var button = document.getElementById('button');

input.setAttribute('value', `${window.frames.name}: `);

function sendMessage() {
  var message = document.getElementById('message').value;
  var div = document.createElement('div');

  // Append and post the message only if the user typed something in the input field
  if (message.length > `${window.frames.name}: `.length) {
    div.innerHTML = message;

    // The second argument of postMessage is targetOrigin ('*' or a URL), I include '*' (indicating no preference) for the sake of simplicity. In a real-world scenerio, always provide a URL, not *, if you know where the other window's document should be located.
    window.parent.postMessage(message, '*');

    content.appendChild(div);

    // Clear the input field after the message is sent
    document.getElementById('message').value = `${window.frames.name}: `;
  }
}

function receiveMessage(event) {
  // if (event.origin !== 'null' || event.origin !== 'file://' || event.origin !== 'https://chat-client-at-dynamic-yield.herokuapp.com/') {
  //   return;
  // }

  var div = document.createElement('div');

  // If the system property of event.data is true, add the notification property of event.data and the notification class to div
  if (event.data.system) {
    div.innerHTML = event.data.notification;
    div.setAttribute('class', 'notification');
  } else {
    div.innerHTML = event.data;
  }

  content.appendChild(div);
}

function eventConstructor(target, type, listener) {
  target.addEventListener(type, listener, false);
}

eventConstructor(button, 'click', sendMessage);

// Receive the message from the child who send back the message
eventConstructor(window, 'message', receiveMessage);
