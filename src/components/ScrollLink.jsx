import { useLocation, useNavigate } from 'react-router-dom'

// Navega a la landing y hace scroll suave a una sección por su id.
// Con HashRouter los anchors nativos chocan con el enrutado, por eso usamos esto.
export default function ScrollLink({ to, children, className, onClick }) {
  const navigate = useNavigate()
  const location = useLocation()
  const id = to.replace(/^#/, '')

  function handleClick(e) {
    e.preventDefault()
    if (onClick) onClick(e)
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(scroll, 80)
    } else {
      scroll()
    }
  }

  return (
    <a href={`#${id}`} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
