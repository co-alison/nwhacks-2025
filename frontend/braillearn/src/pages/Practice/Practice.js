import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import characters from "../../utils/characters";
import { states } from "../../utils/constants";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import theme from "../../styles/theme";
import { Box, Typography, Button } from "@mui/material"; // Importing Material-UI components for consistent styling.
import StyledButton from "../../components/StyledButton";

const Practice = () => {
    const [currentChar, setCurrentChar] = useState("");
    const [status, setStatus] = useState(states.display);
    const [charInput, setCharInput] = useState("");
    const [timerFlag, setTimerFlag] = useState(true);
    const [isListening, setIsListening] = useState(false);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        if (status === states.display) {
            const char = getRandomChar();
            console.log("char: ");
            console.log(char);
            setCurrentChar(char);

            // send char to API
            sendChar(char);
        } else if (status === states.listen) {
            listen();
        } else if (status === states.correct) {
            speakText("Correct!");
        } else if (status === states.incorrect) {
            speakText(`Incorrect, the correct answer was: ${currentChar}`);
        }
    }, [status]);

    useEffect(() => {
        if (isListening && timerFlag) {
            const timer = setTimeout(() => {
                setTimerFlag(0);
                SpeechRecognition.stopListening();
                setIsListening(false);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [timerFlag, isListening]);

    const listen = async () => {
        if (browserSupportsSpeechRecognition) {
            await SpeechRecognition.startListening({ language: "en-US" });
            setIsListening(true);
            console.log("listening", listening);
        } else {
            console.log("browser does not support speech recognition");
        }
    };

    useEffect(() => {
        const stopListen = async () => {
            await SpeechRecognition.stopListening();
            setIsListening(false);
            const input = transcript.split(" ")[0];
            setCharInput(input);
            resetTranscript();
            await verifyChar(input);
        };

        if (!listening && !transcript && !timerFlag) {
            console.log("no input received");
            setCharInput("No input received");
            setStatus(states.incorrect);
        } else if (transcript) {
            stopListen();
        }
    }, [transcript, listening, timerFlag]);

    const sendChar = async (char) => {
        const res = await axios.get(`http://localhost:3001/send-letter?letter=${char}`);
        if (res.status === 200) {
            setStatus(states.listen);
        }
    };

    const getRandomChar = () => {
        const index = Math.floor(Math.random() * characters.length);
        return characters[index];
    };

    const verifyChar = async (input) => {
        console.log("current", currentChar);
        console.log("input", input);

        const res = await axios.get(`http://localhost:3001/get-letter?input=${input}`);
        if (res.data.length !== 1) {
            setStatus(states.incorrect);
            setCharInput("Something went wrong");
            return;
        }

        setCharInput(res.data);
        if (currentChar.toLowerCase() === res.data.toLowerCase()) {
            setStatus(states.correct);
        } else {
            setStatus(states.incorrect);
        }
    };

    const reset = () => {
        const clear = ".";
        // const res = axios.get(`http://localhost:3001/send-letter?letter=${clear}`);
        setCurrentChar("");
        setCharInput("");
        setTimerFlag(true);
        setStatus(states.display);
    };

    const speakText = (text) => {
        // const voices = speechSynthesis.getVoices();
        // voices.forEach(voice => {
        //     console.log(`Name: ${voice.name}, Lang: ${voice.lang}, Voice URI: ${voice.voiceURI}`);
        // });
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
    };

    return (
        <Box
            sx={{
                padding: theme.spacing(4),
                maxWidth: "800px",
                margin: "0 auto",
                textAlign: "center", // Center align content like Home page.
            }}
        >
            {/* Back button positioned at top left */}
            <Box sx={{ position: "absolute", top: theme.spacing(4), left: theme.spacing(4) }}>
                <BackButton />
            </Box>

            {/* Main heading */}
            <Typography variant="h4" sx={{ marginBottom: theme.spacing(4), fontWeight: "bold" }}>
                Practice Braille
            </Typography>

            {status === states.display ? (
                <Typography variant="h5">Displaying Character...</Typography>
            ) : status === states.listen ? (
                <Typography variant="h5">Listening...</Typography>
            ) : status === states.correct ? (
                <Box>
                    <Typography variant="h5">{charInput.toUpperCase()}</Typography>
                    <Typography variant="h6" color="success.main">
                        Correct!
                    </Typography>
                    <StyledButton onClick={reset}>
                        Next
                    </StyledButton>
                </Box>
            ) : status === states.incorrect ? (
                <Box>
                    <Typography variant="h5">{charInput}</Typography>
                    <Typography variant="h6" color="error.main">
                        Incorrect, the correct answer was: {currentChar}
                    </Typography>
                    <StyledButton onClick={reset}>
                        Next
                    </StyledButton>
                </Box>
            ) : null}
        </Box>

    );
};

export default Practice;
