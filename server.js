const express = require('express');
const noble = require('noble');
const app = express();
const port = 3000;

function nobleExceptionHandler(err) {
  if (err.toString().includes("ENODEV")) {
    process.removeListener('uncaughtException', nobleExceptionHandler);
    console.log("Noble: " + err.toString() + " - disabling.");
    errored = true;
  } else throw err;
}

function startNoble() {
  try {
    process.on('uncaughtException', nobleExceptionHandler);
    try {
      noble = require('noble');
    } catch (e) {
      noble = require('@abandonware/noble');
    }
  } catch (e) {
    console.log("Noble: module couldn't be loaded, no node.js Bluetooth Low Energy\n", e);
    process.removeAllListeners('exit');
    errored = true;
    return false;
  }
}

// Serve static files (HTML, JS, etc.)
app.use(express.static('public'));

// Route to handle joystick controls (X and Y values)
app.get('/control', (req, res) => {
  const x = parseInt(req.query.x); // Get X axis value (-10 to +10)
  const y = parseInt(req.query.y); // Get Y axis value (-10 to +10)

  console.log(`Received X: ${x}, Y: ${y}`);

  // Send X and Y values directly to Arduino
  sendBluetoothCommand(x, y);

  res.send(`Received X: ${x}, Y: ${y}`);
});

// Route to handle function1 button press
app.get('/function1', (req, res) => {
  console.log("Function 1 button pressed");

  // Send 'f1' command to Arduino
  sendBluetoothCommand("f1");

  res.send("Function 1 pressed");
});

// Start the server
app.listen(port, () => {
  console.log(`Web server running at http://localhost:${port}`);
});

// Function to send Bluetooth command to Arduino (X, Y values or function commands)
function sendBluetoothCommand(x, y) {
  noble.on('stateChange', (state) => {
    if (state === 'poweredOn') {
      noble.startScanning();
    }
  });

  noble.on('discover', (peripheral) => {
    if (peripheral.advertisement.localName === 'ArduinoBLE') {  // Replace with your Arduino's name
      noble.stopScanning();
      peripheral.connect((err) => {
        if (err) {
          console.log('Error connecting to peripheral:', err);
          return;
        }

        peripheral.discoverServices(['00c1aa0c-f5b4-4aaf-b480-ab81afb460dd'], (err, services) => {
          if (err) {
            console.log('Error discovering services:', err);
            return;
          }

          const service = services[0]; // Assuming you only have one service
          service.discoverCharacteristics(['430afd82-380c-4651-ab90-0e27467374b6'], (err, characteristics) => {
            if (err) {
              console.log('Error discovering characteristics:', err);
              return;
            }

            const characteristic = characteristics[0];
            // If 'f1' is passed, we send 'f1', else send x and y as bytes
            let buffer;
            if (x === 'f1') {
              buffer = Buffer.from([102, 49]);  // ASCII for "f1" as bytes
            } else {
              buffer = Buffer.from([x, y]);  // Send X and Y as bytes
            }
            characteristic.write(buffer, false, (err) => {
              if (err) {
                console.log('Error writing command:', err);
              } else {
                console.log(`Command sent: ${x}, ${y}`);
              }
            });
          });
        });
      });
    }
  });
}





















/*const express = require('express');
const noble = require('noble');
const app = express();
//var BluetoothHciSocket = require('@stoprocent/bluetooth-hci-socket');
const port = 3000;

function nobleExceptionHandler(err) {
  if (err.toString().includes("ENODEV")) {
    process.removeListener('uncaughtException', nobleExceptionHandler);
    console.log("Noble: "+err.toString()+" - disabling.");
    errored = true;
  } else throw err;
}

function startNoble() {
  try {
    process.on('uncaughtException', nobleExceptionHandler);
    try {
      noble = require('noble');
    } catch (e) {
      noble = require('@abandonware/noble');
    }
  } catch (e) {
    console.log("Noble: module couldn't be loaded, no node.js Bluetooth Low Energy\n", e);
    // super nasty workaround for https://github.com/sandeepmistry/noble/issues/502
    process.removeAllListeners('exit');
    errored = true;
    return false;
  }

app.use(express.static('public'));  // Serve static files (HTML, JS, etc.)

// Routes for controlling the robot
app.get('/moveForward', (req, res) => {
  sendBluetoothCommand('f');
  res.send('Moving forward');
});

app.get('/moveBackward', (req, res) => {
  sendBluetoothCommand('b');
  res.send('Moving backward');
});

app.get('/moveLeft', (req, res) => {
  sendBluetoothCommand('l');
  res.send('Moving left');
});

app.get('/moveRight', (req, res) => {
  sendBluetoothCommand('r');
  res.send('Moving right');
});

// Start the server
app.listen(port, () => {
  console.log(`Web server running at http://localhost:${port}`);
});

// Function to send Bluetooth command to Arduino
function sendBluetoothCommand(command) {
  noble.on('stateChange', (state) => {
    if (state === 'poweredOn') {
      noble.startScanning();
    }
  });

  noble.on('discover', (peripheral) => {
    if (peripheral.advertisement.localName === 'ArduinoBLE') {  // Replace with your Arduino's name
      noble.stopScanning();
      peripheral.connect((err) => {
        if (err) {
          console.log('Error connecting to peripheral:', err);
          return;
        }

        peripheral.discoverServices(['00c1aa0c-f5b4-4aaf-b480-ab81afb460dd'], (err, services) => {
          if (err) {
            console.log('Error discovering services:', err);
            return;
          }

          const service = services[0]; // Assuming you only have one service
          service.discoverCharacteristics(['430afd82-380c-4651-ab90-0e27467374b6'], (err, characteristics) => {
            if (err) {
              console.log('Error discovering characteristics:', err);
              return;
            }

            const characteristic = characteristics[0];
            const buffer = Buffer.from(command);
            characteristic.write(buffer, false, (err) => {
              if (err) {
                console.log('Error writing command:', err);
              } else {
                console.log('Command sent:', command);
              }
            });
          });
        });
      });
    }
  });
}
*/