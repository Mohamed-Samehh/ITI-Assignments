import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setSelectedImage(data.thumbnail)
        setLoading(false)
      })
  }, [id])

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <p className="fs-5 text-center m-0">Loading...</p>
      </div>
    )
  if (!product)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <p className="fs-5 text-center m-0">Product not found</p>
      </div>
    )

  return (
    <div className="row">
      {/* Left: Images */}
      <div className="col-md-6">
        <img
          src={selectedImage}
          alt={product.title}
          className="img-fluid rounded mb-3"
          style={{ maxHeight: '350px', width: '100%', objectFit: 'cover' }}
        />
        {/* Thumbnail strip */}
        <div className="d-flex gap-2">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              style={{ width: 60, height: 60, objectFit: 'cover', cursor: 'pointer', border: selectedImage === img ? '2px solid black' : '1px solid #ccc' }}
              className="rounded"
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Right: Info */}
      <div className="col-md-6">
        <h3>{product.title}</h3>
        <p className="text-muted">{product.description}</p>
        <h4>${product.price} <small className="text-muted fs-6">or {(product.price / 6).toFixed(2)}/month</small></h4>
        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
          {product.stock > 0 ? `In stock - ${product.stock} items left` : 'Out of stock'}
        </span>

        <div className="mt-3 d-flex gap-2">
          <span className="badge bg-secondary">{product.category}</span>
          <span className="badge bg-secondary">{product.brand}</span>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-dark">Buy Now</button>
          <button className="btn btn-outline-dark">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails