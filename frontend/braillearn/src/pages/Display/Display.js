import React, { useState, useEffect, useRef } from "react";
import { states } from "../../utils/constants";
import StyledButton from "../../components/StyledButton";
import PageContainer from "../../components/PageContainer";
import StatusCard from "../../components/StatusCard";
import InstructionCard from "../../components/InstructionCard";
import { useStatusConfig } from "../../hooks/useStatusConfig";
import {
  Box,
  TextField,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Keyboard, Mic } from "@mui/icons-material";
import theme from "../../styles/theme";
import {
  sendChar,
  sendWord as sendWordToHardware,
} from "../../utils/serverApi";
import { startListeningWithTimer } from "../../utils/speechRecognition";

function Display() {
  const [textInput, setTextInput] = useState("");
  const [displayedChar, setDisplayedChar] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("text");
  const [speechInputType, setSpeechInputType] = useState("letter");

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const voice =
    speechSynthesis
      .getVoices()
      .find((voice) => voice.name === "Google US English") || null;

  // Clear dots when component unmounts (leaving page)
  useEffect(() => {
    return () => {
      sendChar('.');
    };
  }, []);

  const sendInputValue = async () => {
    if (textInput.length === 1) {
      setError(false);
      setDisplayedChar(textInput);
      if (textInput === ".") {
        speakText("Dots have been cleared.");
      } else {
        speakText(`Letter ${textInput.toUpperCase()} is being displayed`);
      }
      sendChar(textInput);
      setTextInput("");
    } else if (textInput.length > 1) {
      setError(false);
      sendWord(textInput.toLowerCase());
    } else {
      setError(true);
    }
  };

  const sendWord = async (word) => {
    setDisplayedChar(textInput);
    speakText(`${textInput} is being displayed`);
    const res = await sendWordToHardware(word);
    if (res.status === 200) {
      console.log("sent", word, "to the arduino");
      setTextInput(textInput);
    }
  };

  const handleChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setError(false);
      setTextInput("");
      setDisplayedChar("");
      setStatus(null);
    }
  };

  const reset = () => {
    setTextInput("");
    setDisplayedChar("");
    setError(false);
    setStatus(states.listen);
  };

  const clearDots = () => {
    sendChar('.');
    setDisplayedChar('');
    speakText("Dots have been cleared.");
  };

  useEffect(() => {
    console.log("status has changed to ", status);
    if (status === states.listen) {
      startListeningWithTimer(
        timerRef,
        recognitionRef,
        setStatus,
        setTextInput,
        "",
        speechInputType,
        setDisplayedChar
      );
    } else if (status === states.display) {
      console.log("Displaying input: ", textInput);
      if (textInput) {
        sendInputValue();
      } else {
        console.error("Unexpected empty text input");
      }
    } else if (status === states.noInput) {
      speakText("No input received.");
    } else if (status === states.retry) {
      speakText(
        "Sorry, we didn't catch that. Please say 'letter' before your answer, like 'letter A.'"
      );
    }
  }, [status]);

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("enter button");
      sendInputValue();
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.voice = voice;
    speechSynthesis.speak(utterance);
  };

  const statusConfig = useStatusConfig(status, textInput, "", displayedChar);

  return (
    <PageContainer
      title="Display Braille"
      headerContent={
        <Card
          sx={{
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            border: "2px solid #e2e8f0",
          }}
        >
          <CardContent sx={{ padding: "1.5rem", textAlign: "center" }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "1rem",
              }}
            >
              Choose Input Method
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleModeChange}
                aria-label="input method"
                sx={{
                  "& .MuiToggleButtonGroup-grouped": {
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px !important",
                    margin: "0 0.5rem",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    textTransform: "none",
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.custom.buttonBackground,
                      color: "#ffffff",
                      borderColor: theme.palette.custom.buttonBackground,
                      "&:hover": {
                        backgroundColor: theme.palette.custom.buttonHover,
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="text" aria-label="text input">
                  <Keyboard sx={{ marginRight: "0.5rem" }} />
                  Text Input
                </ToggleButton>
                <ToggleButton value="speech" aria-label="speech input">
                  <Mic sx={{ marginRight: "0.5rem" }} />
                  Speech Input
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </CardContent>
        </Card>
      }
    >
      {mode === "speech" ? (
        statusConfig ? (
          <StatusCard
            statusConfig={statusConfig}
            status={status}
            listenStates={[states.listen]}
          >
            {(status === states.display ||
              status === states.noInput ||
              status === states.retry) && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ marginBottom: "1rem" }}>
                  <ToggleButtonGroup
                    value={speechInputType}
                    exclusive
                    onChange={(event, newType) => {
                      if (newType !== null) {
                        setSpeechInputType(newType);
                      }
                    }}
                    aria-label="speech input type"
                    size="small"
                    sx={{
                      "& .MuiToggleButtonGroup-grouped": {
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px !important",
                        margin: "0 0.25rem",
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        textTransform: "none",
                        "&.Mui-selected": {
                          backgroundColor:
                            theme.palette.custom.buttonBackground,
                          color: "#ffffff",
                          borderColor: theme.palette.custom.buttonBackground,
                        },
                      },
                    }}
                  >
                    <ToggleButton value="letter">Letter</ToggleButton>
                    <ToggleButton value="word">Word</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <StyledButton
                  onClick={reset}
                  sx={{
                    minWidth: "150px",
                    fontSize: "1.125rem",
                    marginBottom:
                      status === states.display && displayedChar ? "1rem" : 0,
                  }}
                >
                  Listen Again
                </StyledButton>
                {status === states.display && displayedChar && (
                  <Box
                    sx={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#059669",
                        fontWeight: 600,
                      }}
                    >
                      Displaying: "{displayedChar}"
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </StatusCard>
        ) : (
          <Card
            sx={{
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              border: "2px solid #e2e8f0",
            }}
          >
            <CardContent
              sx={{
                padding: { xs: "1.5rem", md: "2rem" },
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(94, 103, 191, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  color: theme.palette.custom.buttonBackground,
                }}
                aria-hidden="true"
              >
                <Mic sx={{ fontSize: "3rem" }} />
              </Box>

              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: "0.5rem",
                }}
              >
                {speechInputType === "letter"
                  ? "Speak a Single Letter"
                  : "Speak a Word"}
              </Typography>

              <Typography
                variant="body1"
                component="p"
                sx={{
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  color: "#4a5568",
                  marginBottom: "1rem",
                  lineHeight: 1.5,
                }}
              >
                {speechInputType === "letter"
                  ? 'Say "letter" followed by a single character (e.g., "letter A")'
                  : "Click the button and speak a complete word clearly"}
              </Typography>

              <Box
                sx={{
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ToggleButtonGroup
                  value={speechInputType}
                  exclusive
                  onChange={(event, newType) => {
                    if (newType !== null) {
                      setSpeechInputType(newType);
                      setTextInput("");
                      setDisplayedChar("");
                      setStatus(null);
                    }
                  }}
                  aria-label="speech input type"
                  size="small"
                  sx={{
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px !important",
                      margin: "0 0.25rem",
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                      textTransform: "none",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.custom.buttonBackground,
                        color: "#ffffff",
                        borderColor: theme.palette.custom.buttonBackground,
                      },
                    },
                  }}
                >
                  <ToggleButton value="letter">Letter</ToggleButton>
                  <ToggleButton value="word">Word</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <StyledButton
                onClick={() => setStatus(states.listen)}
                sx={{
                  minWidth: "150px",
                  fontSize: "1.125rem",
                }}
              >
                Start Listening
              </StyledButton>
            </CardContent>
          </Card>
        )
      ) : (
        <Card
          sx={{
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            border: "2px solid #e2e8f0",
          }}
        >
          <CardContent
            sx={{
              padding: { xs: "1.5rem", md: "2rem" },
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(94, 103, 191, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                color: theme.palette.custom.buttonBackground,
              }}
              aria-hidden="true"
            >
              <Keyboard sx={{ fontSize: "3rem" }} />
            </Box>

            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "0.5rem",
              }}
            >
              Type Your Character or Word
            </Typography>

            <Typography
              variant="body1"
              component="p"
              sx={{
                fontSize: { xs: "0.875rem", md: "1rem" },
                color: "#4a5568",
                marginBottom: "1rem",
                lineHeight: 1.5,
              }}
            >
              Enter a single character or a complete word
            </Typography>

            <Box sx={{ maxWidth: "400px", margin: "0 auto 1rem" }}>
              <TextField
                id="display-text-input"
                label="Character or Word"
                error={error}
                helperText={error ? "Please enter a character or word" : ""}
                variant="outlined"
                value={textInput}
                onChange={handleChange}
                onKeyPress={onKeyPress}
                fullWidth
                placeholder="Type here..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "1.25rem",
                    padding: "0.25rem",
                    borderRadius: "8px",
                    "&:hover fieldset": {
                      borderColor: theme.palette.custom.buttonBackground,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.custom.buttonBackground,
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "1rem",
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <StyledButton
                onClick={sendInputValue}
                disabled={!textInput}
                sx={{
                  minWidth: "150px",
                  fontSize: "1.125rem",
                }}
              >
                Display on box
              </StyledButton>

              <StyledButton
                onClick={clearDots}
                sx={{
                  minWidth: "150px",
                  fontSize: "1.125rem",
                  backgroundColor: '#ef4444',
                  '&:hover': {
                    backgroundColor: '#dc2626',
                  },
                }}
              >
                Clear Dots
              </StyledButton>
            </Box>

            {displayedChar && (
              <Box
                sx={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#059669",
                    fontWeight: 600,
                  }}
                >
                  Displaying: "{displayedChar}"
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <InstructionCard title="How to Use Display Mode">
        <strong>Text Input:</strong>
        <br />
        1. Type any character (a-z) or word in the text field
        <br />
        2. Press Enter or click "Display on box"
        <br />
        3. Feel the braille output on your box
        <br />
        <br />
        <strong>Speech Input:</strong>
        <br />
        1. Choose "Single Letter" or "Word" mode
        <br />
        2. Click "Start Listening"
        <br />
        3. For letters: Say "letter" followed by a character (e.g., "letter A")
        <br />
        4. For words: Speak the complete word clearly
        <br />
        5. The box will display your input in braille
      </InstructionCard>
    </PageContainer>
  );
}

export default Display;
