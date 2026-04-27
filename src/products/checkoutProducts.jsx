import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../api/orders";
import { AuthContext } from "../usercontext/context/authContext";

export default function CheckoutPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadOrder = async () => {
      const response = await getOrderById(id);

      if (!response.success) {
        navigate("/");
        return;
      }

      if (user && String(response.data.userId) !== String(user.id)) {
        navigate("/");
        return;
      }

      setOrder(response.data);
      setLoading(false);
    };

    loadOrder();
  }, [id, navigate, user]);

  if (loading) return <Typography>Loading...</Typography>;

  if (!order) return <Typography>Order not found</Typography>;

  return (
    <Box display="flex" justifyContent="center" p={4}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: "900px" }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <ShoppingBagIcon color="primary" />
          <Typography variant="h5" fontWeight="bold">
            Order Placed
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
            </TableRow>
          </TableHead>

          <TableBody>
            {order.items?.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.desc}</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>₹{item.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Grand Total</Typography>

          <Box display="flex" alignItems="center">
            <CurrencyRupeeIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {order.totalPrice}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
