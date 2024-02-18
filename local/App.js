import logo from './logo.svg';
import './App.css';
import React from 'react';

function App () {

  const [bool, setBool] = React.useState(false);
  const [num, setNum] = React.useState(0);

  React.useEffect(() => {
    console.log('this only runs on first render');
  }, []);

  React.useEffect(() => {
    console.log('renders whenever num changes');
  }, [num]);

  React.useEffect(() => {
    console.log('runs on every render');
  });

  const updateBool = () => {
    setBool(!bool);
  }
  const increaseNum = () => {
    setNum(num + 1);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={updateBool}>Update Bool</button>
        <button onClick={increaseNum}>Increase num</button>

      </header>
    </div>
  );
}

export default App;
