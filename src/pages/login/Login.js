import React, { useContext, useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { UserContext } from '../../providers/UserProvider';

import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {

  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: ''
  });

  let navigate = useNavigate();
  let { user } = useContext(UserContext);

  const handleChange = e => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };
  
  const handleSignIn = e => {
    e.preventDefault();
    const { email, password } = loginFormData;

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigate('/admin'))
      .catch(error => {
        console.log(`Error ${error.code} : ${error.message}`);
        alert('Email ou mot de passe incorrect');
      });
  };

  // if user already sign in
  if (typeof user === 'object') return <Navigate to='/' />;

  return (
    <div className='login'>
      <div className='container'>
        <h1>Login</h1>

        <div className='form-container'>
          <form onSubmit={handleSignIn}>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                type='email'
                required
                placeholder='user@example.com'
                value={loginFormData.email}
                onChange={handleChange} />
            </div>
            <div>
              <label htmlFor='password'>Mot de passe</label>
              <input
                id='password'
                name='password'
                type='password'
                required
                placeholder='Mot de passe'
                value={loginFormData.password}
                onChange={handleChange} />
            </div>
            <button>Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
