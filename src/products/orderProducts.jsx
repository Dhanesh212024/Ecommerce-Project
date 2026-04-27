import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../usercontext/context/authContext";
import { ProductContext } from "../productcontext/productContext";
import { createOrder } from "../api/orders";

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { products, loading } = useContext(ProductContext);

  const [orderItems, setOrderItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const storageKey = user ? `orderItems_${user.id}` : "orderItems_guest";

  const selectedProduct = useMemo(() => {
    return products.find((p) => String(p.id) === String(id));
  }, [products, id]);

  useEffect(() => {
    if (loading || !selectedProduct) return;

    const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];

    const alreadyAdded = savedItems.some(
      (item) => String(item.product.id) === String(selectedProduct.id)
    );

    let updatedItems = savedItems;

    if (!alreadyAdded) {
      updatedItems = [
        ...savedItems,
        {
          product: selectedProduct,
          quantity: 1,
        },
      ];
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderItems(updatedItems);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  }, [loading, selectedProduct, storageKey]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!selectedProduct) {
    return <Typography>Product not found</Typography>;
  }

  const handleQuantityChange = (productId, value) => {
    let quantity = Number(value);

    if (quantity < 1) quantity = 1;
    if (quantity > 5) quantity = 5;

    const updatedItems = orderItems.map((item) =>
      String(item.product.id) === String(productId)
        ? { ...item, quantity }
        : item
    );

    setOrderItems(updatedItems);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  };

  const handleRemoveProduct = (productId) => {
    const updatedItems = orderItems.filter(
      (item) => String(item.product.id) !== String(productId)
    );

    setOrderItems(updatedItems);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  };

  const totalPrice = orderItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const handleAddMoreProducts = () => {
    localStorage.setItem(storageKey, JSON.stringify(orderItems));
    navigate("/");
  };

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

    if (!orderItems.length) {
      alert("Please add at least one product");
      return;
    }

    const orderData = {
      userId: user.id,
      items: orderItems.map((item) => ({
        productId: item.product.id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      })),
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    setSubmitting(true);

    const response = await createOrder(orderData);

    if (!response.success) {
      setSubmitting(false);
      alert(response.message || "Unable to save order");
      return;
    }

    localStorage.removeItem(storageKey);
    navigate(`/checkout/${response.data.id}`);
  };

  return (
    <Box display="flex" justifyContent="center" p={4}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: "900px" }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <ShoppingCartIcon color="primary" />
          <Typography variant="h5" fontWeight="bold">
            Order Summary
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
            {orderItems.map((item) => (
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

        <Box mt={3}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddMoreProducts}
          >
            Add More Products
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
          startIcon={<AddShoppingCartIcon />}
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
