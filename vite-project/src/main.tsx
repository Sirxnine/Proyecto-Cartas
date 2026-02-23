import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes}  from 'react-router'
import FormularioCarta from './componentes/Form.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/Form' element={<FormularioCarta onCrear={(carta) => console.log(carta)} />} />
    </Routes>
  </BrowserRouter>,
)
