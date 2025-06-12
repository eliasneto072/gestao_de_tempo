const API = 'http://localhost:3333/api';

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const register = async (email: string, password: string) => {
  const res = await fetch(`${API}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const getTasks = async (token: string) => {
  const res = await fetch(`${API}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const createTask = async (title: string, token: string) => {
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });
  return res.json();
};

export const toggleComplete = async (id: number, token: string) => {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};
