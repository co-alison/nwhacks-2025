import React, {useState, useEffect} from "react";
import BackButton from "../../components/BackButton";
import characters from "../../utils/characters";
import { states } from "../../utils/constants";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Practice = () => {
    const [currentChar, setCurrentChar] = useState("");
    const [status, setStatus] = useState(states.display);
    const [charInput, setCharInput] = useState("");
    const [timerFlag, setTimerFlag] = useState(true);
    const [correctResponse, setCorrectResponse] = useState(false);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

    useEffect(() => {
        if (status === states.display) {
            const char = getRandomChar();
            console.log("char: ");
            console.log(char);
            setCurrentChar(char);
            // setIsInitialized(true);
            
            // send char to API
            sendChar(char);
        } else if (status === states.listen) {
            listen();
        }

    }, [status]);

    useEffect(() => {
        if (listening && timerFlag) {
            const timer = setTimeout(() => {
                setTimerFlag(0);
                SpeechRecognition.stopListening();
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [timerFlag, listening])

    const listen = async () => {
        if (browserSupportsSpeechRecognition) {
            await SpeechRecognition.startListening({ language: 'en-US' });
            console.log("listening", listening);
        } else {
            console.log("browser does not support speech recognition");
        }
    }

    useEffect(() => {
        const stopListen = async () => {
            await SpeechRecognition.stopListening();
            const input = transcript.split(" ")[0];
            setCharInput(input); 
            resetTranscript(); 
            verifyChar(input);
            setStatus(states.response); 
        }

        if (!listening && !transcript && !timerFlag && !charInput) {
            setCharInput("no input received");
            setStatus(states.response);
        } else if (transcript) {
            stopListen();
        }
    }, [transcript, listening, timerFlag])

    const sendChar = async (char) => {
        // console.log(char);
        const res = await axios.get(`http://localhost:3001/send-letter?letter=${char}`);
        if (res.status === 200) {
            setStatus(states.listen);
        }
    }

    const getRandomChar = () => {
        const index = Math.floor(Math.random() * characters.length);
        return characters[index];
    }

    const verifyChar = (input) => {
        console.log("current", currentChar);
        console.log("input", input);
        if (currentChar.toLowerCase() === input.toLowerCase()) {
            setCorrectResponse(true);
        } else {
            setCorrectResponse(false);
        }
    }
    return (
        <div>
            <BackButton />
            <h1>Practice page</h1>
            { status === states.display ? (
                <div>
                    <h2>Displaying Character...</h2>
                </div>
            ) : status === states.listen ? (
                <div>
                    <h2>Listening...</h2>
                </div>
            ) : status === states.response ? (
                <div>
                    <h2>{charInput.split(" ")[0]}</h2>
                    <h3>{correctResponse ? "Correct" : "Incorrect"}</h3>
                </div>
            ) : null}
        </div>
    )
}

export default Practice;