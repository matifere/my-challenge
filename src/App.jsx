import { useEffect, useState } from 'react'
import './App.css'
import { List, ListItem, TextField, Button, Alert } from '@mui/material';

function App() {
  const [candidate, setCandidate] = useState(null);
  const [cargando, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [jobs, setJobs] = useState([]);
  //______________BLOQUE URLS______________________
  //URL BASE
  const url = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';
  //URL USUARIO
  const urlEmail = url + "/api/candidate/get-by-email?email=matifere@gmail.com";
  //URL JOBS
  const urlJobs = url + "/api/jobs/get-list";
  //URL POSTULAR JOB
  const urlPostular = url + "/api/candidate/apply-to-job";
  //_______________________________________________
  useEffect(() => {
    const fetchCandidato = async () => {

      try {
        setLoading(true);
        //STEP 2
        const respuestaNombre = await fetch(urlEmail);
        if (!respuestaNombre.ok) {
          const errorData = await respuestaNombre.json();
          throw new Error(errorData.message || 'Error al obtener el nombre');
        }

        const data = await respuestaNombre.json();
        setCandidate(data);

        //STEP 3
        const respuestaJobs = await fetch(urlJobs);
        if (!respuestaJobs.ok) {
          const errorData = await respuestaJobs.json();
          throw new Error(errorData.message || 'Error al obtener trabajos');
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
      <List>
        {jobs.map((item) => (
          <JobItem
            key={item.id}
            item={item}
            enviar={enviar}
          />
        ))}
      </List>

    </div>
  )
  async function enviar(jobId, urlDelHijo) {
    const dataAEnviar = {
      "uuid": candidate.uuid,
      "jobId": jobId,
      "candidateId": candidate.candidateId,
      "repoUrl": urlDelHijo,
      //esto no aparecia en el mail pero me lo marcaba en la consola
      "applicationId": candidate.applicationId
    }
    try {
      const respuesta = await fetch(urlPostular, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataAEnviar)
      });
      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Error al enviar la postulacion');
      } else {
        alert('Postulacion enviada!');
      }
    }
    catch (e) { alert('Algo salio mal ' + e) }
  }
}

function JobItem(props) {
  const [input, setInput] = useState('');
  return (
    <ListItem sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2, alignItems: 'center' }}>
      <h3>{props.item.title}</h3>
      <TextField
        sx={{ backgroundColor: 'white', borderRadius: 1 }}
        type="text"
        placeholder="URL de tu repo"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <Button variant="contained" onClick={() => props.enviar(props.item.id, input)}>
        Submit
      </Button>
    </ListItem>
  );
}


export default App
