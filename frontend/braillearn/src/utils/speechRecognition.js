import { states } from "./constants";

export const startListeningWithTimer = (timerRef, recognitionRef, setStatus, setCharInput, currentChar) => {
    console.log("start");
    try {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        const speechGrammarList = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();

        const grammar = `
            #JSGF V1.0;
            grammar letters;
            public <letter> = A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z 
             | letter A | letter B | letter C | letter D | letter E | letter F | letter G | letter H | letter I 
             | letter J | letter K | letter L | letter M | letter N | letter O | letter P | letter Q | letter R 
             | letter S | letter T | letter U | letter V | letter W | letter X | letter Y | letter Z;
            `;
        speechGrammarList.addFromString(grammar, 1);

        recognition.grammars = speechGrammarList;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            console.log("on result");
            clearTimeout(timerRef.current);
            const spokenInput = event.results[0][0].transcript.trim().toLowerCase();
            const confidence = event.results[0][0].confidence;
            if (currentChar) {
                console.log("verify and set char")
                verifyAndSetChar(spokenInput, confidence, currentChar, setStatus, setCharInput);
            } else {
                console.log("set input only")
                setInputOnly(spokenInput, confidence, setStatus, setCharInput)
            }
            recognition.stop();
        }

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);

            if (event.error === "no-speech") {
                setStatus(states.noInput);
                setCharInput("No input received");
                return;
            }

            clearTimeout(timerRef.current);
            setStatus(states.retry);
        };

        recognition.onnomatch = (event) => {
            console.log('no match found:', event);
            setStatus(states.retry);
        }


        recognition.onspeechend = () => {
            console.log('speech end');
        };

        recognition.onend = () => {
            console.log("stopped");
            recognition.abort();
            recognitionRef.current = null;
        }

        recognition.start();
        recognitionRef.current = recognition;

        timerRef.current = setTimeout(() => {
            stopListeningDueToTimeout(recognitionRef, setStatus, setCharInput);
        }, 10000);
    } catch (error) {
        console.error('Error starting speech recognition:', error);
    }
};

export const stopListeningDueToTimeout = (recognitionRef, setStatus, setCharInput) => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        setStatus(states.noInput);
        setCharInput("No input received");
    }
};

export const verifyAndSetChar = async (input, confidence, currentChar, setStatus, setCharInput) => {
    console.log('current', currentChar);
    console.log('input', input);
    console.log('confidence', confidence);

    if (input.trim().length === 1) {
        if (input.trim().toLowerCase() === currentChar) {
            setStatus(states.correct);
            setCharInput(currentChar);
            return;
        } else {
            setStatus(states.incorrect);
            setCharInput(input.trim().toLowerCase());
            return;
        }
    }

    if (input.startsWith("letter ") && input.length > 7 && confidence >= 0.5) {
        const detectedLetter = input.split(" ")[1];
        if (!detectedLetter || detectedLetter.length !== 1) {
            console.log("invalid letter detected");
            setStatus(states.retry);
            return;
        }
        console.log(`detectedLetter: ${detectedLetter}`);
        setCharInput(detectedLetter.toLowerCase());

        if (detectedLetter.trim().toLowerCase() === currentChar.trim().toLowerCase()) {
            setStatus(states.correct);
        } else {
            setStatus(states.incorrect);
        }
    } else if (confidence < 0.5 || !input.startsWith("letter")) {
        console.log("low confidence");
        setStatus(states.retry);
    } else {
        console.log("unrecognized input", input);
        setStatus(states.retry);
    }
};

export const setInputOnly = async (input, confidence, setStatus, setCharInput) => {
    console.log('input', input);
    console.log('confidence', confidence);
    setCharInput(input);
    setStatus(states.display);
};