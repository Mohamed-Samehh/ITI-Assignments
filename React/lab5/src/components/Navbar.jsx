import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLanguage } from '../context/useLanguage'

function Navbar() {
  const items = useSelector(state => state.cart.items)
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)
  const { language, setLanguage, direction } = useLanguage()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Products App</Link>
        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
          <select
            className="form-select form-select-sm"
            style={{ width: '90px' }}
            value={language}
            onChange={e => setLanguage(e.target.value)}
            aria-label="Select language"
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>

          <span className="text-light small text-uppercase">{direction}</span>

          <Link className="btn btn-outline-light btn-sm" to="/">Products</Link>

          <Link className="btn btn-outline-light btn-sm" to="/register">Register</Link>

          <Link className="btn btn-outline-light btn-sm" to="/contact">Contact</Link>

          <Link className="btn btn-light btn-sm position-relative" to="/cart">
            Cart
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cartItemsCount}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar