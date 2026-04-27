import { Button, TextField, Typography, Grid, Paper, Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "./context/authContext";
import { useNavigate } from "react-router-dom";
import { RHFTextField, ImageConvert } from "../component";

export default function RegisterPage() {
  const { addData, authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const RegisterSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    contact: yup
      .string()
      .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
      .required("Contact is required"),
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
    dob: yup.string().required("DOB is required"),
    address: yup.string().required("Address is required"),
    pan: yup 
      .string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (ABCDE1234F)")
      .required("PAN is required"),
    panImage: yup.string().required("PAN Image is required"),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    password: "",
    dob: "",
    address: "",
    pan: "",
    panImage: "",
  };

  const method = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = method;

  useEffect(() => {
  if (authenticated) {
    navigate("/", { replace: true });
  }
}, [authenticated]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const base64 = await ImageConvert(file);
      method.setValue("panImage", base64);
    } catch (error) {
      console.error("File convert error:", error);
    }
  };

  const onSubmit = async (data) => {
    const response = await addData(data);
    console.log(data);

    if (response.success) {
      alert("User is Registered");
      reset();
      navigate("/login", {replace: true});
    } else {
      alert("User is not Registered");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Grid item xs={6}>
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              borderRadius: 3,
              width: "100%",
              maxWidth: "400px",
              margin: "auto",
            }}
          >
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold">
                User Registration (KYC)
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column">
              <Grid spacing={2}>
                <RHFTextField
                  name="firstName"
                  label="First Name"
                  control={control}
                />
                <RHFTextField
                  name="lastName"
                  label="Last Name"
                  control={control}
                />
                <RHFTextField
                  name="contact"
                  label="Contact"
                  control={control}
                />
                <RHFTextField name="email" label="Email ID" control={control} />

                <RHFTextField
                  name="password"
                  label="Password"
                  type="password"
                  control={control}
                />

                <RHFTextField
                  name="dob"
                  label="DOB"
                  type="date"
                  control={control}
                />

                <RHFTextField
                  name="address"
                  label="Address"
                  multiline
                  rows={2}
                  control={control}
                />

                <RHFTextField
                  name="pan"
                  label="PAN Card No."
                  control={control}
                />

                  <Button variant="outlined" component="label" fullWidth>
                    Upload Pan Image
                    <input
                      type="file"
                      name="panImage"
                      hidden
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </Button>

                <Grid item xs={12}>
                  <Button
                    sx={{mt:3}}
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </form>
  );
}
