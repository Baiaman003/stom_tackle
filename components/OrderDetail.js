import Link from 'next/link'
import PaypalBtn from './paypalBtn'
import { patchData } from '../utils/fetchData'
import { updateItem } from '../store/Actions'

const OrderDetail = ({ orderDetail, state, dispatch }) => {
  const { auth, orders } = state

  const handleDelivered = (order) => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

      const { paid, dateOfPayment, method, delivered } = res.result

      dispatch(
        updateItem(
          orders,
          order._id,
          {
            ...order,
            paid,
            dateOfPayment,
            method,
            delivered,
          },
          'ADD_ORDERS',
        ),
      )

      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
    })
  }

  if (!auth.user) return null
  return (
    <>
      {orderDetail.map((order) => (
        <div key={order._id} style={{ margin: '20px auto' }} className='row justify-content-around'>
          <div className='text-uppercase my-3' style={{ maxWidth: '600px' }}>
            <h2 className='text-break'>Заказ {order._id}</h2>

            <div className='mt-4 text-secondary'>
              <h3 className='mt-3'>Оформление</h3>
              <p>Имя: {order.user.name}</p>
              <p>еmail: {order.user.email}</p>
              <p>адрес: {order.address}</p>
              <p>телефон: {order.mobile}</p>

              <h3 className='mt-3'>Доставка</h3>
              <div
                className={`alert ${order.delivered ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`}
                role='alert'>
                {order.delivered ? `Доставлено в ${order.updatedAt}` : 'Не доставлен'}
                {auth.user.role === 'admin' && !order.delivered && (
                  <button
                    className='btn btn-dark text-uppercase'
                    onClick={() => handleDelivered(order)}>
                    как доставленное
                  </button>
                )}
              </div>

              <h3 className='mt-3'>Оплата</h3>
              {order.method && (
                <h6>
                  Метод: <em>{order.method}</em>
                </h6>
              )}

              {order.paymentId && (
                <p>
                  Id оплаты: <em>{order.paymentId}</em>
                </p>
              )}

              <div
                className={`alert ${order.paid ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`}
                role='alert'>
                {order.paid ? `Оплачено ${order.dateOfPayment}` : 'НЕ ОПЛАЧЕНО'}
              </div>

              <div>
                <h3 className='mt-3'>O заказe</h3>
                {order.cart.map((item) => (
                  <div
                    className='row border-bottom mx-0 p-2 justify-content-betwenn
                                    align-items-center'
                    key={item._id}
                    style={{ maxWidth: '550px' }}>
                    <img
                      src={item.images[0].url}
                      alt={item.images[0].url}
                      style={{ width: '50px', height: '45px', objectFit: 'cover' }}
                    />

                    <h5 className='flex-fill text-secondary px-3 m-0'>
                      <Link href={`/product/${item._id}`}>
                        <a>{item.title}</a>
                      </Link>
                    </h5>

                    <span className='text-info m-0'>
                      {item.quantity} x ${item.price} = ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!order.paid && auth.user.role !== 'admin' && (
            <div className='p-4'>
              <h2 className='mb-4 text-uppercase'>Итого: ${order.total}</h2>
              <PaypalBtn order={order} />
            </div>
          )}
          <button
            className='btn btn-danger'
            data-toggle='modal'
            data-target='#exampleModal'
            onClick={() =>
              dispatch({
                type: 'ADD_MODAL',
                payload: [
                  {
                    data: '',
                    id: order._id,
                    title: order.user,
                    type: 'DELETE_ORDER',
                  },
                ],
              })
            }>
            Удалить заказ
          </button>
        </div>
      ))}
    </>
  )
}

export default OrderDetail
