import { Paper, Typography, Box, Button } from "@mui/material";

export default function Card({ name, desc, price, discount, image, onBuy }) {
  return (
    <Paper elevation={3} sx={{ borderRadius: 3 }}>
      <Box
        component="img"
        src={`${image}?auto=format&fit=crop&w=400&q=80`}
        alt={name}
        sx={{
          width: "100%",
          height: 180,
          objectFit: "cover",
        }}
      />
      <Box p={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="body2" color="success.main">
            {discount}% OFF
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {desc}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          {/* <Button variant="contained" fullWidth onClick={onBuy}>
          Add to Cart
          </Button> */}
          <Button variant="contained" fullWidth onClick={onBuy}>
            ₹{price}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
