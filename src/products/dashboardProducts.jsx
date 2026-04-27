import { Grid, Typography, Box, TextField } from "@mui/material";
import Card from "./card/product-card";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../usercontext/context/authContext"; // adjust path if needed
import { ProductContext } from "../productcontext/productContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { authenticated } = useContext(AuthContext);
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
    } else {
      navigate(`/order/${id}`);
    }
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
