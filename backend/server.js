const express = require("express");
const { SerialPort, ReadlineParser } = require("serialport");
const cors = require("cors");
const getLetterFromSpeech = require("./ai/generate_letter");

const app = express();

app.use(cors());

// Initialize SerialPort
const port = new SerialPort({ path: "COM4", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

port.on("open", () => {
    console.log("Serial port open on COM4");

    // Listen for data on the serial port
    parser.on("data", (data) => {
        console.log("Received:", data.trim());
        if (data.trim() === "Done") {
            console.log("Arduino has finished displaying the Braille letter.");
        }
    });
});

port.on("error", (err) => {
    console.error("Serial port error:", err.message);
});

port.on("close", () => {
    console.log("Serial port closed");
});

app.get("/send-letter", (req, res) => {
    const letter = req.query.letter;
    if (letter) {
        console.log("Sending letter:", letter);
        res.send("Letter sent: " + letter);
        // port.write(letter + "\n", (err) => {
        //     if (err) {
        //         return res.status(500).send("Error on write: " + err.message);
        //     }
        //     res.send("Letter sent: " + letter);
        // });
    } else {
        res.status(400).send("No letter provided");
    }
});

app.get("/get-letter", (req, res) => {
    const input = req.query.input;
    if (input) {
        getLetterFromSpeech(input).then((letter) => {
            if (letter) {
                letter = letter.replace(/'/g, "");
                console.log(`Predicted letter: ${letter}`);
                res.send(letter);
            } else {
                console.log("Failed to predict the letter.");
                res.status(500).send("Failed to predict the letter.");
            }
        });
    } else {
        res.status(400).send("No input provided");
    }
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
