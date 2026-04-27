import { Button, TextField, Typography, Grid, Paper, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import { RHFTextField } from "../component";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, authenticated } = useContext(AuthContext);

  const LoginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid Email Format")
      .required("Email is Required"),
    password: yup.string().required(" Password Required "),
  });
  const defaultValues = {
    email: "",
    password: "",
  };

  const method = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = method;

  useEffect(() => {
  if (authenticated) {
    navigate("/", { replace: true });
  }
}, [authenticated]);

  const OnSubmit = handleSubmit(async (data) => {
    try {
      const response = await login(data);
      console.log(response);

      if (response?.success) {
        alert("Login Done");
        navigate("/", { replace: true });
      } else {
        alert(response?.message || "Login is fail");
      }

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <form onSubmit={OnSubmit}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              borderRadius: 3,
              width: "100%",
              maxWidth: "900px",
              margin: "auto",
            }}
          >
            <Box textAlign="center" mb={3}>
              <Typography variant="h5" fontWeight="bold">
                User Login
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <RHFTextField name="email" label="Email ID" control={control} />

              <RHFTextField
                name="password"
                label="Password"
                type="password"
                control={control}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <Link to="/register" variant="body2" color="secondary">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </form>
  );
}
