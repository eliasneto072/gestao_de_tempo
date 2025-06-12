import { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const data = await login(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert('Login inválido');
    }
  };

  return (
  <div className="container">
    <h2>Login</h2>
    <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
    <input placeholder="Senha" type="password" onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handleSubmit}>Entrar</button>
  </div>
);

}
