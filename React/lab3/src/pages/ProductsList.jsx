import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ProductsList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  const limit = 10
  const navigate = useNavigate()

  const goToPreviousPage = () => {
    setLoading(true)
    setPage(p => p - 1)
  }

  const goToNextPage = () => {
    setLoading(true)
    setPage(p => p + 1)
  }

  useEffect(() => {
    const skip = page * limit

    fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
        setTotal(data.total)
        setLoading(false)
      })
  }, [page])

  const totalPages = Math.ceil(total / limit)

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <p className="fs-5 text-center m-0">Loading products...</p>
      </div>
    )

  return (
    <div>
      {/* Products Grid */}
      <div className="row row-cols-2 row-cols-md-4 mt-3 g-3">
        {products.map(product => (
          <div className="col" key={product.id}>
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.thumbnail}
                className="card-img-top"
                alt={product.title}
                style={{ height: '160px', objectFit: 'cover' }}
              />
              <div className="card-body">
                {/* Stock Badge */}
                <span className={`badge mb-1 ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                  {product.stock > 0 ? 'In stock' : 'Out of stock'}
                </span>
                <h6 className="card-title">{product.title}</h6>
                <p className="text-muted small">{product.description?.slice(0, 50)}...</p>
                <p className="fw-bold">${product.price}</p>
                {/* Star Rating */}
                <button className="btn btn-dark btn-sm w-100">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center gap-2 mt-4 mb-4">
        <button
          className="btn btn-outline-dark"
          onClick={goToPreviousPage}
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="align-self-center">Page {page + 1} of {totalPages}</span>
        <button
          className="btn btn-outline-dark"
          onClick={goToNextPage}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ProductsList