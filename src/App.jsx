import { Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop.jsx'
import Landing from './pages/Landing.jsx'
import Explorar from './pages/Explorar.jsx'
import Detalle from './pages/Detalle.jsx'
import Reserva from './pages/Reserva.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/camping/:id" element={<Detalle />} />
        <Route path="/reservar/:id" element={<Reserva />} />
      </Routes>
    </>
  )
}
