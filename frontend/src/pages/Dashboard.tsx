import { useEffect, useState } from 'react'
import { createTask } from '../api' // ✅ Função de criar tarefa

interface Profile {
  email: string
  level: number
  points: number
}

interface Task {
  id: number
  title: string
  completed: boolean
}

export function Dashboard() {
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
  }, [])

  useEffect(() => {
    if (!token) return

    setLoading(true)
    setError(null)

    fetch('http://localhost:3333/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Erro ao buscar perfil')
        }
        return res.json()
      })
      .then((profileData) => {
        setProfile(profileData)
      })
      .catch((err) => {
        setError(err.message)
        setProfile(null)
      })

    fetch('http://localhost:3333/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Erro ao buscar tarefas')
        }
        return res.json()
      })
      .then((tasksData) => {
        setTasks(tasksData)
      })
      .catch((err) => {
        setError(err.message)
        setTasks([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !token) return

    try {
      const task = await createTask(newTaskTitle, token)
      setTasks((prev) => [...prev, task])
      setNewTaskTitle('')
    } catch (err) {
      alert('Erro ao criar tarefa')
    }
  }

  if (loading) return <p>Carregando dados...</p>
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>
  if (!profile) return <p>Usuário não encontrado ou não autenticado.</p>

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>Bem-vindo, {profile.email}</h1>
      <p>Nível: {profile.level}</p>
      <p>XP: {profile.points}/100</p>

      <h2>Tarefas</h2>

      {/* Campo de nova tarefa */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Nova tarefa"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{
            flex: '1 1 70%',
            minWidth: 200,
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 14,
          }}
        />
        <button
          onClick={handleCreateTask}
          style={{
            flex: '0 0 auto',
            padding: '8px 14px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: '500',
            fontSize: 14,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Adicionar
        </button>
      </div>

      {/* Lista de tarefas */}
      <ul>
        {tasks.length === 0 && <li>Você não tem tarefas</li>}
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.completed ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard
