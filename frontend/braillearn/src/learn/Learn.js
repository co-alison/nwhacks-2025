import React, { useState } from 'react';
import axios from 'axios';

function Learn() {
    const [char, setChar] = useState('0');

    const getCharacterValue = () => {
        const inputField = document.getElementById('char-input');
        if (inputField) {
            setChar(inputField.value);
            // send selected char to api to show
            const res = axios.get(
                `http://localhost:3001/send-letter?letter=${char}`
            );
        }
    };


    return (
        <div className='Learn'>
            <header className='Learn-header'>
                <h1>Learn Braille</h1>
                <input id='char-input' type='text' maxLength='1' name='char' />
                <button
                    type='button'
                    id='display-btn'
                    onClick={getCharacterValue}
                >
                    Display
                </button>
            </header>
        </div>
    );
}

export default Learn;
