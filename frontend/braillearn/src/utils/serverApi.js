import axios from "axios";
import { featureFlags } from "../featureFlags";

export const sendChar = async (char, callback) => {
  if (featureFlags.usingHardware) {
    try {
      //   const input = "." + char;
      //   const res = await axios.get(
      //     `http://localhost:3001/send-word?word=${input}`
      //   );
      const res = await axios.get(
        `http://localhost:3001/send-letter?letter=${char}`
      );

      if (res.status === 200) {
        console.log("Sent", char, "to the arduino");
        if (callback) {
          callback();
        }
      }
      if (callback) {
        callback();
      }
    } catch (e) {
      console.log(`Error sending character to the arduino: ${e}`);
    }
  } else {
    console.log('"Sent"', char, 'to the "arduino" (not using hardware)');
    if (callback) {
      callback();
    }
  }
};

export const sendWord = async (word, callback) => {
  if (featureFlags.usingHardware) {
    try {
      //   const input = "." + word;
      //   const res = await axios.get(
      //     `http://localhost:3001/send-word?word=${input}`
      //   );

      const res = await axios.get(
        `http://localhost:3001/send-word?word=${word}`
      );

      if (res.status === 200) {
        console.log("Sent", word, "to the arduino");
        if (callback) {
          callback();
        }
      }
      if (callback) {
        callback();
      }
      return res;
    } catch (e) {
      console.log(`Error sending word to the arduino: ${e}`);
    }
  } else {
    console.log('"Sent"', word, 'to the "arduino" (not using hardware)');
    if (callback) {
      callback();
    }
    return { status: 200, mock: true };
  }
};

export const getLetter = async (letter, callback) => {
  try {
    if (featureFlags.usingHardware) {
      const res = await axios.get(
        `http://localhost:3001/get-letter?input=${letter}`
      );

      if (res.status === 200) {
        const predictedLetter = res.data;
        console.log("Got", predictedLetter, "from the Arduino");
        if (callback) callback(predictedLetter);
        return predictedLetter;
      } else {
        throw new Error(`Unexpected response status: ${res.status}`);
      }
    } else {
      console.log(`"Got" ${letter} from the "Arduino" (not using hardware)`);
      if (callback) callback(letter);
      return letter;
    }
  } catch (e) {
    console.error(`Error getting letter from the Arduino: ${e}`);
    return null;
  }
};
