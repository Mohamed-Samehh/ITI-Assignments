import { useState } from 'react'

const initialFormData = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  message: '',
}

function validateContactForm(values) {
  const newErrors = {}

  if (!values.email.trim()) {
    newErrors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    newErrors.email = 'Please enter a valid email address.'
  }

  if (!values.firstName.trim()) {
    newErrors.firstName = 'First name is required.'
  }

  if (!values.lastName.trim()) {
    newErrors.lastName = 'Last name is required.'
  }

  if (!values.message.trim()) {
    newErrors.message = 'Message is required.'
  } else if (values.message.trim().length < 10) {
    newErrors.message = 'Message must be at least 10 characters.'
  } else if (values.message.trim().length > 500) {
    newErrors.message = 'Message must be 500 characters or fewer.'
  }

  return newErrors
}

function ContactUs() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = event => {
    const { name, value } = event.target
    const updatedData = { ...formData, [name]: value }
    setFormData(updatedData)

    if (successMessage) {
      setSuccessMessage('')
    }

    if (submitted) {
      setErrors(validateContactForm(updatedData))
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    setSubmitted(true)

    const formErrors = validateContactForm(formData)
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      setSuccessMessage('Thanks! We received your message and will get to you soon.')
      setFormData(initialFormData)
      setErrors({})
      setSubmitted(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-9 col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h3 mb-3">Contact Us</h1>
            <p className="text-muted mb-4">Fill out the form and we will get back to you soon.</p>

            {successMessage ? (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            ) : null}

            <form noValidate onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.firstName}</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.lastName}</div>
                </div>

                <div className="col-md-6">
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

                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">Phone (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    value={formData.message}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.message}</div>
                  <div className="form-text">{formData.message.length}/500</div>
                </div>
              </div>

              <button type="submit" className="btn btn-dark mt-4">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs