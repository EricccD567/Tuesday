import React, { useRef } from 'react';
import { LoginForm } from '../components';

function Login() {
  // ref to email and password text fields in login form
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <LoginForm emailRef={emailRef} passwordRef={passwordRef} />
  );
}

export default Login;
