import { Grid, Typography, Box, TextField } from "@mui/material";
import Card from "./card/product-card";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../usercontext/context/authContext"; // adjust path if needed
import { ProductContext } from "../productcontext/productContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { user, authenticated } = useContext(AuthContext);
  const { products, loading } = useContext(ProductContext);

  const filteredProducts = products.filter((product) => {
    const searchValue = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchValue) ||
      product.desc.toLowerCase().includes(searchValue) ||
      String(product.price).includes(searchValue)
    );
  });

  const handleBuy = (id) => {
    if (!authenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const selectedProduct = products.find(
      (product) => String(product.id) === String(id),
    );

    if (!selectedProduct) {
      alert("Product not found");
      return;
    }

    const storageKey = user ? `orderItems_${user.id}` : "orderItems_guest";
    const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];

    const alreadyAdded = savedItems.some(
      (item) => String(item.product.id) === String(selectedProduct.id),
    );

    const updatedItems = alreadyAdded
      ? savedItems.map((item) =>
          String(item.product.id) === String(selectedProduct.id)
            ? { ...item, quantity: Math.min(item.quantity + 1, 5) }
            : item,
        )
      : [...savedItems, { product: selectedProduct, quantity: 1 }];

    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    navigate("/cart");
  };

  if (loading) return <Typography>Loading products...</Typography>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="end" mb={4}>
        <TextField
          label="Search products"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "400px" }}
        />
      </Box>

      <Grid container spacing={6} pl={6}>
        {filteredProducts.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Card
              name={item.name}
              desc={item.desc}
              price={item.price}
              discount={item.discount}
              image={item.image}
              onBuy={() => handleBuy(item.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
