import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    common: {
      white: 'hsl(0, 0%, 100%)',
      black: 'hsl(0, 0%, 0%)',
    },
    primary: {
      // light: will be calculated from palette.primary.main,
      main: 'hsl(251, 78%, 67%)',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main,
    },
    secondary: {
      light: 'hsl(255, 100%, 86%)',
      main: 'hsl(240, 68%, 78%)',
    },
    tertiary: {
      main: 'hsl(267, 53%, 84%)',
    },
    neutral: {
      light: 'hsl(290, 100%, 99%)',
      main: 'hsl(18, 51%, 90%)',
    },
    status: {
      green: 'hsl(120, 60%, 67%)',
      yellow: 'hsl(60, 96%, 79%)',
      orange: 'hsl(35, 100%, 64%)',
      red: 'hsl(3, 100%, 69%)',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: 'Roboto',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
