var button = document.getElementById('button');
var container = document.getElementsByClassName('container')[0];

var iframes = {};
var iframeCounter = 1;
var iframeName = `iframe${iframeCounter}`;
var user = [];

var mouseInitialPositionX = 0, mouseInitialPositionY = 0, distanceOfMovementOfMouseX = 0, distanceOfMovementOfMouseY = 0;

function iframeAdder() {
  var iframe = document.createElement('iframe');

  iframe.setAttribute('src', 'iframe/index.html');
  iframe.setAttribute('class', 'item');
  iframe.setAttribute('name', iframeName);
  iframe.setAttribute('frameborder', '0');

  iframes[iframeName] = iframe;
  iframeCounter++;
  iframeName = `iframe${iframeCounter}`;

  container.appendChild(iframe);

  // Draggable iframe needs to be improved. The first one is draggable to some extent.
  // dragIframe(iframe);

  // If multiple identical EventListeners are registered on the same EventTarget with the same parameters, the duplicate instances are discarded. They do not cause the EventListener to be called twice, and they do not need to be removed manually with the removeEventListener method.
  // button.removeEventListener('click', iframeAdder);
}

function receiveMessage(event) {
  // Check the origin of the window that sent the message at the time postMessage was called. It must be the same origin.
  // if (event.origin !== 'null' || event.origin !== 'file://' || event.origin !== 'https://chat-client-at-dynamic-yield.herokuapp.com/') {
  //   return;
  // }

  var eventSourceName = event.source.name;

  // Post the message to other children
  for (var name in iframes) {
    // Display system notification only if the user joined the conversation at the first time
    if (user.indexOf(eventSourceName) === -1) {
      // Create an eventData object that has system notification and pass it to other iframes
      var eventData = {
        system: true,
        notification: `system: ${eventSourceName} joined the conversation.`
      };

      iframes[name].contentWindow.postMessage(eventData, event.origin);
    }

    if (name !== eventSourceName) {
      iframes[name].contentWindow.postMessage(event.data, event.origin);
    }
  }

  user.push(eventSourceName);
}

function eventConstructor(target, type, listener) {
  target.addEventListener(type, listener, false);
}

function eventDestructor(target, type, listener) {
  target.removeEventListener(type, listener, false);
}

function dragIframe(iframe) {
  eventConstructor(iframe.contentWindow, 'mousedown', mousedown);

  function mousedown(event) {
    // Get the mouse initial position when its button is pressed
    mouseInitialPositionX = event.clientX;
    mouseInitialPositionY = event.clientY;

    eventConstructor(iframe.contentWindow, 'mouseup', mouseup);
    // Invoke mousemove listener whenever the mouse moves
    eventConstructor(iframe.contentWindow, 'mousemove', mousemove);
  }

  function mousemove(event) {
    // Calculate the distance of movement of the mouse and its new initial position
    distanceOfMovementOfMouseX = mouseInitialPositionX - event.clientX;
    distanceOfMovementOfMouseY = mouseInitialPositionY - event.clientY;
    mouseInitialPositionX = event.clientX;
    mouseInitialPositionY = event.clientY;

    // Set the new position of the iframe
    iframe.contentWindow.frameElement.style.left = (iframe.contentWindow.frameElement.offsetLeft - distanceOfMovementOfMouseX) + 'px';
    iframe.contentWindow.frameElement.style.top = (iframe.contentWindow.frameElement.offsetTop - distanceOfMovementOfMouseY) + 'px';
  }

  function mouseup() {
    eventDestructor(iframe.contentWindow, 'mouseup', mouseup);
    // Stop moving when the mouse button is released
    eventDestructor(iframe.contentWindow, 'mousemove', mousemove);
  }
}

eventConstructor(button, 'click', iframeAdder);

// Receive the message from the child
eventConstructor(window, 'message', receiveMessage);
