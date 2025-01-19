import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';
import { states } from '../../utils/constants';

function Learn() {
    const [textInput, setTextInput] = useState('');
    const [displayedChar, setDisplayedChar] = useState('');
    const [status, setStatus] = useState(states.listen);

    const getCharacterValue = async () => {
        SpeechRecognition.stopListening();
        sendChar(textInput);
    };

    const sendChar = async (char) => {
        const res = await axios.get(
            `http://localhost:3001/send-letter?letter=${char}`
        );

        if (res.status === 200) {
            console.log('sent', char, 'to the arduino');
            setTextInput(textInput);
            setDisplayedChar(textInput);
        }
    };
    const handleChange = (e) => {
        setTextInput(e.target.value);
    };

    const reset = () => {
        setTextInput('');
        setDisplayedChar('');

        setStatus(states.listen);
    };

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        if (status === states.listen) {
            listen();
        }
    }, [status]);

    const listen = async () => {
        if (browserSupportsSpeechRecognition) {
            await SpeechRecognition.startListening({
                continuous: true,
                language: 'en-US',
            });
            console.log('listening', listening);
        } else {
            console.log('browser does not support speech recognition');
        }
    };

    useEffect(() => {
        const stopListen = async () => {
            await SpeechRecognition.stopListening();
            const input = transcript.split(' ')[0];
            setTextInput(input);
            setDisplayedChar(input);

            resetTranscript();
            setStatus(states.response);
        };

        if (!listening && !transcript) {
            setStatus(states.response);
        } else if (transcript) {
            stopListen();
        }
    }, [transcript, listening]);

    return (
        <div className='Learn'>
            <BackButton />
            <header className='Learn-header'>
                <h1>Learn Braille</h1>
                <input
                    id='char-input'
                    type='text'
                    maxLength='1'
                    name='char'
                    value={textInput}
                    onChange={handleChange}
                />
                <button
                    type='button'
                    id='display-btn'
                    onClick={getCharacterValue}
                >
                    Display
                </button>

                {displayedChar !== '' && (
                    <h3>The character {displayedChar} is displayed.</h3>
                )}
            </header>
            <button type='button' id='next-btn' onClick={reset}>
                Next
            </button>
        </div>
    );
}

export default Learn;
