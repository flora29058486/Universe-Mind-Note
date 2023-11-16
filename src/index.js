// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App.jsx';
// // import './index.css';

// ReactDOM.render(
//   <App />, 
//   document.getElementById('root')
// );

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import ToggleButtonsOnMainKonva from './components/MUI/ToggleButtonOnMainKonva/ToggleButtonOnMainKonva.jsx';
import App from './App.jsx';

// ReactDOM.createRoot(document.querySelector("#toggle-button")).render(
//   // <React.StrictMode>
//   //   <StyledEngineProvider injectFirst>
//   //     <ToggleButtonsOnMainKonva />
//   //   </StyledEngineProvider>
//   // </React.StrictMode>

//   <ToggleButtonsOnMainKonva />
// );

ReactDOM.createRoot(document.querySelector("#root")).render(
  <App />
);

document.getElementById('drag1').ondragstart = (event) => {
  event.preventDefault()
  window.electron.startDrag('drag-and-drop-1.md')
}

document.getElementById('drag2').ondragstart = (event) => {
  event.preventDefault()
  window.electron.startDrag('drag-and-drop-2.md')
}
