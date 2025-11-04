import { Link } from 'react-router-dom'

function Sidebar({ links = [] }) {
  return (
    <aside className="sidebar">
      <ul>
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar


