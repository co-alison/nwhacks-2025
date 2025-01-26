import axios from 'axios';

export const sendChar = async (char, callback) => {
    try {
        const res = await axios.get(
            `http://localhost:3001/send-letter?letter=${char}`
        );

        if (res.status === 200) {
            console.log('Sent', char, 'to the arduino');
            if (callback) {
                callback();
            }
        }
    } catch (e) {
        console.log(`Error sending character to the arduino: ${e}`);
    }
};
