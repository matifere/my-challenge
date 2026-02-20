import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [candidate, setCandidate] = useState(null);
  useEffect(() => {
    const fetchCandidato = async () => {
      const respuesta = await fetch('')
    }
  })
  return (
    <div></div>
  )
}

export default App
