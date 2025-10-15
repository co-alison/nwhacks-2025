# Braillearn

## Instructions

> If you are not connected to the hardware, flip the `usingHardware` feature flag in `/frontend/braillearn/src/featureFlags.js` to `false`. Otherwise, keep it at `true`. 

### Frontend

1. From root directory, `cd frontend/braillearn`
2. Run `npm install`
3. Run `npm start`

### Backend

1. From root directory, `cd backend`
2. First load the hardware and upload the code onto the Arduino (see Hardware section below)
3. Change the COM port in `backend/server.js` to the correct port for your Arduino ~line 10 (e.g., 'COM3' on Windows or '/dev/ttyACM0' on Linux)
4. Run `npm install` to install dependencies
5. Run `npm start`

### Hardware
1. Download Arduino IDE from https://www.arduino.cc/en/software
2. Open or load `hardware/BrailleController.c` in Arduino IDE
3. Connect the Arduino to your computer via USB
4. Select the correct board and port in Arduino IDE: Tools > Board > Arduino Uno, Tools > Port > (Select the port that says Arduino)
5. Click the upload button (right arrow icon) to upload the code to the Arduino
