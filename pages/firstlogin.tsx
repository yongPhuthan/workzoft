// pages/login.js
import { useState } from 'react';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginWithCredentials = async (e) => {
    e.preventDefault();
    signIn('credentials', { email, password, callbackUrl:'/companySetting', });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLoginWithCredentials}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log in with Email</button>
      </form>
      <hr />
      <button onClick={() => signIn('line',{callbackUrl:'/companySetting'})}>Log in with Line</button>
    </div>
  );
};

export default LoginPage;
