import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [candidate, setCandidate] = useState(null);
  const [cargando, setLoading] = useState(true);
  const [error, setError] = useState([]);

  const [jobs, setJobs] = useState(null);
  useEffect(() => {
    const fetchCandidato = async () => {
      //URL BASE
      const url = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';
      //URL USUARIO
      const urlEmail = url + "/api/candidate/get-by-email?email=matifere@gmail.com";
      //URL JOBS
      const urlJobs = url + "/api/jobs/get-list";
      try {
        setLoading(true);
        //STEP 2
        const respuestaNombre = await fetch(urlEmail);
        if (!respuestaNombre.ok) {
          const errorData = await respuestaNombre.json();
          throw new Error(errorData.message || 'Error');
        }

        const data = await respuestaNombre.json();
        setCandidate(data);

        //STEP 3
        const respuestaJobs = await fetch(urlJobs);
        if (!respuestaJobs.ok) {
          const errorData = await respuestaJobs.json();
          throw new Error(errorData.message || 'Error');
        }
        const dataJobs = await respuestaJobs.json();
        setJobs(dataJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    //LLAMADAS
    fetchCandidato();

  }, []);
  if (cargando) return <p>Cargando datos del candidato...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  return (
    <div>
      <h1>Hola, soy {candidate?.firstName}</h1>
      <p>Los siguientes puestos estan disponibles:</p>
      <ul>
        {jobs.map((item) => (
          <li key={item.id}>
            {item.title}
          </li>

        ))}
      </ul>

    </div>
  )
}

export default App
