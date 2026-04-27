import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "./context/authContext";
import { updateUser } from "../api/users";

export default function UserProfile() {
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    contact: user?.contact || "",
    email: user?.email || "",
    dob: user?.dob || "",
    address: user?.address || "",
    pan: user?.pan || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    const response = await updateUser(user.id, formData);

    if (response.success) {
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      alert("Profile updated successfully");
    } else {
      alert("Profile update failed");
    }
  };

  return (
    <Box display="flex" justifyContent="center" p={4}>
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          My Profile
        </Typography>

        <Grid container spacing={2}>
          {["firstName", "lastName", "contact", "email", "dob", "address", "pan"].map(
            (field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  fullWidth
                  name={field}
                  label={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </Grid>
            )
          )}

          <Grid item xs={12}>
            <Button fullWidth variant="contained" onClick={handleUpdate}>
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
