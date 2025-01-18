import React, {useState, useEffect} from "react";
import BackButton from "../../components/BackButton";
import characters from "../../utils/characters";
import { states } from "../../utils/constants";
import axios from "axios";

const Practice = () => {
    const [currentChar, setCurrentChar] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [status, setStatus] = useState(states.display);

    useEffect(() => {
        if (status === states.display && !isInitialized) {
            const char = getRandomChar();
            console.log("char: ");
            console.log(char);
            setCurrentChar(char);
            setIsInitialized(true);
            
            // send char to API
            sendChar(char);
        }

    }, [status]);

    const sendChar = async (char) => {
        console.log(char);
        const res = await axios.get(`http://localhost:3001/send-letter?letter=${char}`);
        if (res.status === 200) {
            setStatus(states.listen);
        }
    }

    const getRandomChar = () => {
        const index = Math.floor(Math.random() * characters.length);
        return characters[index];
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
            ) : null}
        </div>
    )
}

export default Practice;