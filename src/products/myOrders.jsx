import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../usercontext/context/authContext";
import { getMyOrders } from "../api/orders";

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const response = await getMyOrders(user.id);

      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.message || "Unable to load orders");
      }

      setLoading(false);
    };

    loadOrders();
  }, [user]);

  const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value = 0) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <Box p={4}>
        <Typography variant="h6">Loading orders...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Paper sx={{ p: 4, width: 520, textAlign: "center" }} elevation={3}>
          <ReceiptLongIcon color="error" sx={{ fontSize: 48, mb: 2 }} />

          <Typography variant="h5" fontWeight="bold" mb={1}>
            Orders could not be loaded
          </Typography>

          <Typography color="text.secondary" mb={3}>
            {error}
          </Typography>

          <Button variant="contained" onClick={() => navigate("/")}>
            Go to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!orders.length) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Paper sx={{ p: 4, width: 520, textAlign: "center" }} elevation={3}>
          <ShoppingBagIcon color="primary" sx={{ fontSize: 52, mb: 2 }} />

          <Typography variant="h5" fontWeight="bold" mb={1}>
            No orders yet
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Products you order will appear here.
          </Typography>

          <Button variant="contained" onClick={() => navigate("/")}>
            Start Shopping
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, md: 4 }} bgcolor="grey.50" minHeight="calc(100vh - 64px)">
      <Box maxWidth={1000} mx="auto">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              My Orders
            </Typography>

            <Typography color="text.secondary">
              Track your recent purchases and order totals.
            </Typography>
          </Box>

          <Chip
            icon={<ReceiptLongIcon />}
            label={`${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Stack spacing={3}>
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
              <Paper key={order.id} elevation={2} sx={{ borderRadius: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                  p={3}
                >
                  <Box>
                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                      <ReceiptLongIcon color="primary" />

                      <Typography variant="h6" fontWeight="bold">
                        Order #{order.id}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={1}>
                      <CalendarMonthIcon fontSize="small" color="action" />

                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack alignItems={{ xs: "flex-start", sm: "flex-end" }} gap={1}>
                    <Chip
                      label={order.status || "Placed"}
                      color="success"
                      size="small"
                    />

                    <Stack direction="row" alignItems="center">
                      <CurrencyRupeeIcon color="primary" fontSize="small" />

                      <Typography variant="h6" fontWeight="bold">
                        {formatNumber(order.totalPrice)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                <Stack divider={<Divider flexItem />}>
                  {items.map((item) => (
                    <Box
                      key={item.productId}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      p={3}
                    >
                      <Avatar
                        src={item.product?.image}
                        alt={item.product?.name}
                        variant="rounded"
                        sx={{ width: 72, height: 72 }}
                      />

                      <Box flexGrow={1} minWidth={0}>
                        <Typography fontWeight="bold" noWrap>
                          {item.product?.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.product?.desc}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                          Quantity: {item.quantity}
                        </Typography>
                      </Box>

                      <Box textAlign="right" minWidth={120}>
                        <Typography variant="body2" color="text.secondary">
                          Item Total
                        </Typography>

                        <Typography fontWeight="bold">
                          {formatCurrency(item.total)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
