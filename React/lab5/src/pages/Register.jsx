import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialFormData = {
  name: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
}

function validateRegisterForm(values) {
  const newErrors = {}

  if (!values.name.trim()) {
    newErrors.name = 'Name is required.'
  }

  if (!values.email.trim()) {
    newErrors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    newErrors.email = 'Please enter a valid email address.'
  }

  if (!values.username.trim()) {
    newErrors.username = 'Username is required.'
  } else if (/\s/.test(values.username)) {
    newErrors.username = 'Username must not contain spaces.'
  }

  if (!values.password) {
    newErrors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters.'
  } else if (!/[A-Z]/.test(values.password)) {
    newErrors.password = 'Password must include at least one uppercase letter.'
  }

  if (!values.confirmPassword) {
    newErrors.confirmPassword = 'Confirm password is required.'
  } else if (values.confirmPassword !== values.password) {
    newErrors.confirmPassword = 'Confirm password must match password.'
  }

  return newErrors
}

function Register() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleChange = event => {
    const { name, value } = event.target
    const updatedData = { ...formData, [name]: value }
    setFormData(updatedData)

    if (submitted) {
      setErrors(validateRegisterForm(updatedData))
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    setSubmitted(true)

    const formErrors = validateRegisterForm(formData)
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      setFormData(initialFormData)
      navigate('/')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 mb-3">Register</h1>
            <p className="text-muted mb-4">Create your account by filling in all required fields.</p>

            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.name}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.username}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.password}</div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              </div>

              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register