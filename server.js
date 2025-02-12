const express = require('express');
const noble = require('noble');
const app = express();
const port = 3000;

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

        peripheral.discoverServices(['180D'], (err, services) => {
          if (err) {
            console.log('Error discovering services:', err);
            return;
          }

          const service = services[0]; // Assuming you only have one service
          service.discoverCharacteristics(['2A37'], (err, characteristics) => {
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
