import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../store/cartSlice'

function Cart() {
  const dispatch = useDispatch()
  const items = useSelector(state => state.cart.items)

  const totalItems = items.reduce((count, item) => count + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (totalItems === 0) {
    return (
      <div className="text-center mt-5">
        <h2>Your Cart</h2>
        <p className="text-muted">Your cart is empty. Start shopping!</p>
        <Link to="/" className="btn btn-dark">Go to Products</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Cart</h2>
        <span className="badge bg-dark fs-6">{totalItems} item(s)</span>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      width="60"
                      height="60"
                      className="rounded"
                      style={{ objectFit: 'cover' }}
                    />
                    <span>{item.title}</span>
                  </div>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <div className="btn-group" role="group" aria-label={`Quantity controls for ${item.title}`}>
                    <button
                      className="btn btn-success"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                    >
                      +
                    </button>
                    <button className="btn btn-light" disabled>{item.quantity}</button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                    >
                      -
                    </button>
                  </div>
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end">
        <div className="card p-3" style={{ minWidth: '240px' }}>
          <p className="mb-1">Total items: {totalItems}</p>
          <h5 className="m-0">Total: ${totalPrice.toFixed(2)}</h5>
        </div>
      </div>
    </div>
  )
}

export default Cart