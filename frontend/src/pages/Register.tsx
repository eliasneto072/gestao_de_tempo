import { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const data = await register(email, password);
    if (data.id) {
      alert('Registro concluído');
      navigate('/');
    } else {
      alert('Erro ao registrar');
    }
  };

  return (
  <div className="container">
    <h2>Registro</h2>
    <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
    <input placeholder="Senha" type="password" onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handleRegister}>Registrar</button>
  </div>
);

}
