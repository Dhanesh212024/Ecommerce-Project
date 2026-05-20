import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, Divider, TextField, Table, TableBody, TableCell, TableHead, TableRow, } from "@mui/material"; 
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { AuthContext } from "../usercontext/context/authContext";
import { createOrder } from "../api/orders";

export default function CartProducts() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const storageKey = user ? `orderItems_${user.id}` : "orderItems_guest";

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems(savedItems);
  }, [storageKey]);

  const handleQuantityChange = (productId, value) => {
    let quantity = Number(value);

    if (quantity < 1) quantity = 1;
    if (quantity > 5) quantity = 5;

    const updatedItems = cartItems.map((item) =>
      String(item.product.id) === String(productId)
        ? { ...item, quantity }
        : item
    );

    setCartItems(updatedItems);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  };

  const handleRemoveProduct = (productId) => {
    const updatedItems = cartItems.filter(
      (item) => String(item.product.id) !== String(productId)
    );

    setCartItems(updatedItems);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem(storageKey);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (user.kycStatus !== "approved") {
      alert("KYC Status is still pending.");
      return;
    }

    if (!cartItems.length) {
      alert("Please add at least one product");
      return;
    }

    const orderData = {
      userId: user.id,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      })),
      totalPrice,
      createdAt: new Date().toISOString(),
      status: "Placed",
    };

    setSubmitting(true);

    const response = await createOrder(orderData);

    setSubmitting(false);

    if (!response.success) {
      alert(response.message || "Unable to save order");
      return;
    }

    localStorage.removeItem(storageKey);
    navigate(`/checkout/${response.data.id}`);
  };

  if (!cartItems.length) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Paper elevation={4} sx={{ p: 4, width: 500, textAlign: "center" }}>
          <ShoppingCartIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Your cart is empty
          </Typography>

          <Button variant="contained" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" p={4}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: "900px" }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <ShoppingCartIcon color="primary" />

          <Typography variant="h5" fontWeight="bold">
            My Cart
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.product.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.desc}</TableCell>
                <TableCell>₹{item.product.price}</TableCell>

                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.product.id, e.target.value)
                    }
                    inputProps={{ min: 1, max: 5 }}
                    sx={{ width: 90 }}
                  />
                </TableCell>

                <TableCell>₹{item.product.price * item.quantity}</TableCell>

                <TableCell>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => handleRemoveProduct(item.product.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box display="flex" gap={2} mt={3}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/")}
          >
            Add More Products
          </Button>

          <Button color="error" variant="outlined" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Grand Total</Typography>

          <Box display="flex" alignItems="center">
            <CurrencyRupeeIcon color="primary" />

            <Typography variant="h6" fontWeight="bold">
              {totalPrice}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3, borderRadius: 2 }}
          onClick={handleCheckout}
          disabled={submitting}
        >
          {submitting ? "Saving Order..." : "Proceed to Checkout"}
        </Button>
      </Paper>
    </Box>
  );
}
