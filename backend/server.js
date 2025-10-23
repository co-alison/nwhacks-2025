const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');
const cors = require('cors');
const getLetterFromSpeech = require('./ai/generate_letter');

const app = express();

app.use(cors());

// Serial port configuration
const SERIAL_PORT_PATH = "/dev/cu.usbserial-110";
const BAUD_RATE = 9600;
const RECONNECT_INTERVAL = 2000; // Try to reconnect every 2 seconds

let port = null;
let parser = null;
let reconnectTimer = null;

// Function to initialize serial port connection
function initializeSerialPort() {
    // Clear any existing reconnect timer
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    try {
        port = new SerialPort({ 
            path: SERIAL_PORT_PATH, 
            baudRate: BAUD_RATE,
            autoOpen: false 
        });

        parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

        port.open((err) => {
            if (err) {
                console.error('Error opening serial port:', err.message);
                scheduleReconnect();
            }
        });

        port.on('open', () => {
            console.log(`Serial port open on ${SERIAL_PORT_PATH}`);

            parser.on('data', (data) => {
                console.log('Received:', data.trim());
                if (data.trim() === 'Done') {
                    console.log('Arduino has finished displaying the braille letter.');
                }
            });
        });

        port.on('error', (err) => {
            console.error('Serial port error:', err.message);
            scheduleReconnect();
        });

        port.on('close', () => {
            console.log('Serial port closed. Attempting to reconnect...');
            scheduleReconnect();
        });

    } catch (err) {
        console.error('Error creating serial port:', err.message);
        scheduleReconnect();
    }
}

// Schedule a reconnection attempt
function scheduleReconnect() {
    if (!reconnectTimer) {
        console.log(`Will attempt to reconnect in ${RECONNECT_INTERVAL / 1000} seconds...`);
        reconnectTimer = setTimeout(() => {
            console.log('Attempting to reconnect to serial port...');
            initializeSerialPort();
        }, RECONNECT_INTERVAL);
    }
}

// Check if serial port is open and ready
function isPortReady() {
    return port && port.isOpen;
}

// Initialize serial port on startup
initializeSerialPort();

app.get('/send-letter', (req, res) => {
    const letter = req.query.letter;
    
    if (!letter) {
        return res.status(400).send('No letter provided');
    }

    if (!isPortReady()) {
        return res.status(503).send('Serial port not connected. Please ensure device is plugged in.');
    }

    console.log('Sending letter:', letter);
    port.write(letter + '\n', (err) => {
        if (err) {
            console.error('Error writing to serial port:', err.message);
            return res.status(500).send('Error on write: ' + err.message);
        }
        res.send('Letter sent: ' + letter);
    });
});

app.get('/send-word', (req, res) => {
    const word = req.query.word;
    
    if (!word) {
        return res.status(400).send('No word provided');
    }

    if (!isPortReady()) {
        return res.status(503).send('Serial port not connected. Please ensure device is plugged in.');
    }

    const letters = word.split('').join('.').split(''); // clear each char before sending next
    let i = 0;
    const interval = setInterval(() => {
        if (i < letters.length) {
            const letter = letters[i];

            console.log('Sending letter:', letter);
            port.write(letter + '\n', (err) => {
                if (err) {
                    clearInterval(interval);
                    console.error('Error writing to serial port:', err.message);
                    return res.status(500).send('Error on write: ' + err.message);
                }
            });
            i++;
        } else {
            clearInterval(interval);
            res.send('Word sent: ' + word);
        }
    }, 2000);
});

app.get('/get-letter', (req, res) => {
    const input = req.query.input;
    if (input) {
        getLetterFromSpeech(input).then((letter) => {
            if (letter) {
                letter = letter.replace(/'/g, '');
                console.log(`Predicted letter: ${letter}`);
                res.send(letter);
            } else {
                console.log('Failed to predict the letter.');
                res.status(500).send('Failed to predict the letter.');
            }
        });
    } else {
        res.status(400).send('No input provided');
    }
});

// Status endpoint to check serial port connection
app.get('/status', (req, res) => {
    res.json({
        connected: isPortReady(),
        port: SERIAL_PORT_PATH,
        message: isPortReady() ? 'Serial port connected' : 'Serial port disconnected'
    });
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
