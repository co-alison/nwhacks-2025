import { states } from "./constants";

export const startListeningWithTimer = (timerRef, recognitionRef, setStatus, setCharInput, currentChar) => {
    console.log("start");
    try {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
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
            clearTimeout(timerRef.current);
            const spokenInput = event.results[0][0].transcript.trim().toLowerCase();
            const confidence = event.results[0][0].confidence;
            verifyChar(spokenInput, confidence, currentChar, setStatus, setCharInput);
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

        recognition.onspeechend = () => {
            console.log('speech end');
            // recognition.abort();
            // stopAudio();
            // recognitionRef.current = null;
        };

        recognition.onend = () => {
            console.log("stopped");
            recognition.abort();
            recognitionRef.current = null;
            // stopAudio();
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
        // stopAudio();
        setStatus(states.noInput);
        setCharInput("No input received");
    }
};

// export const stopAudio = () => {
//     if (microphoneRef.current) {
//         console.log('disconnect');
//         microphoneRef.current.disconnect();
//     }
//     if (audioContextRef.current) {
//         console.log("close");
//         audioContextRef.current.close();
//         audioContextRef.current = null;
//     }

//     if (volumeIntervalRef.current) {
//         clearInterval(volumeIntervalRef.current);
//     }

//     setVolume(0);
// };

// export const setupAudio = async () => {
//     try {
//         const audioContext = new window.AudioContext();
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const microphone = audioContext.createMediaStreamSource(stream);

//         const gainNode = audioContext.createGain();
//         gainNode.gain.value = 2;

//         const noiseSuppressionFilter = audioContext.createBiquadFilter();
//         noiseSuppressionFilter.type = 'lowpass';
//         noiseSuppressionFilter.frequency.value = 3000;

//         // const analyser = audioContext.createAnalyser();
//         // analyser.fftSize = 256;

//         microphone.connect(gainNode);
//         gainNode.connect(noiseSuppressionFilter);
//         // noiseSuppressionFilter.connect(analyser);

//         audioContextRef.current = audioContext;
//         // analyserRef.current = analyser;
//         microphoneRef.current = microphone;

//         // monitorVolume();
//     } catch (error) {
//         console.error("Error setting up audio:", error)
//     }
// };

// export const monitorVolume = () => {
//     const analyser = analyserRef.current;
//     const dataArray = new Uint8Array(analyser.fftSize);

//     const updateVolume = () => {
//         analyser.getByteFrequencyData(dataArray);
//         const maxVolume = Math.max(...dataArray) / 255;
//         setVolume(maxVolume);
//     };

//     volumeIntervalRef.current = setInterval(updateVolume, 100);
// };

export const verifyChar = async (input, confidence, currentChar, setStatus, setCharInput) => {
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
        console.log(`detectedLetter: ${detectedLetter}`);
        setCharInput(detectedLetter.toLowerCase());

        if (detectedLetter.trim().toLowerCase() === currentChar.trim().toLowerCase()) {
            setStatus(states.correct);
        } else {
            setStatus(states.incorrect);
        }
    } else if (confidence < 0.5 || !input.startsWith("letter")) {
        // TODO: further process the input using NLP, currently asks user to try again on low confidence
        // const splitInput = input.split(" ");
        // for (const word of splitInput) {
        //     const res = await axios.get(`http://localhost:3001/get-letter-nlp?input=${input}`);

        // }
        console.log("low confidence");
        setStatus(states.retry);
    } else {
        console.log("unrecognized input", input);
        setStatus(states.retry);
    }
};