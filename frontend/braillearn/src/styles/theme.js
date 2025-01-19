import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    h7: {
      fontSize: "3rem",
      fontWeight: 700,
      fontFamily: "'Roboto', sans-serif",
      background: "linear-gradient(90deg,rgb(142, 198, 247), #5e67bf)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },
  palette: {
    custom: {
      buttonBackground: "#5e67bf",
      buttonHover: "#4b539c",
    },
  },
});

export default theme;