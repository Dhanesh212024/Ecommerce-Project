import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../usercontext/context/authContext";
import { getMyOrders } from "../api/orders";

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;

      const response = await getMyOrders(user.id);

      if (response.success) {
        setOrders(response.data);
      }
    };

    loadOrders();
  }, [user]);

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map((order) => {
        const items = order.items || [
          {
            productId: order.productId,
            product: order.product,
            quantity: order.quantity,
            total: order.totalPrice,
          },
        ];  

        return (
          <div key={order.id}>
            <h3>Order #{order.id}</h3>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Total: ₹{order.totalPrice}</p>

            {items.map((item) => (
              <div key={item.productId}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  width="80"
                />
                <h4>{item.product.name}</h4>
                <p>{item.product.desc}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.product.price}</p>
                <p>Item Total: ₹{item.total}</p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
