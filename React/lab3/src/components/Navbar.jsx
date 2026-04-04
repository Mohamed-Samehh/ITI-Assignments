import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Products App</Link>
        <div className="d-flex gap-3">
          <Link className="nav-link text-white" to="/">Products</Link>
          <Link className="nav-link text-white" to="/cart">
            🛒 Cart
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar