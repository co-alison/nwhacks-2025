const express = require('express');
const { SerialPort } = require('serialport');
const app = express();
const cors = require('cors');

// TODO: use SerialPort when Arduino is connected
// const port = new SerialPort({
//     path: '/dev/tty-usb0',
//     baudRate: 9600,
// });

app.use(cors());

app.get('/send-letter', (req, res) => {
    const letter = req.query.letter;
    if (letter) {
        res.send('Letter sent: ' + letter);
        // TODO: write to the port when Arduino is connected
        // port.write(letter, (err) => {
        //     if (err) {
        //         return res.status(500).send('Error on write: ' + err.message);
        //     }
        //     res.send('Letter sent: ' + letter);
        // });
    } else {
        res.status(400).send('No letter provided');
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
