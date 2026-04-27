import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Controller } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function RHFTextField({ control, name, type, label, ...other }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...other}
          margin="normal"
          fullWidth
          label={label}
          name={name}
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          type={isPassword && showPassword ? "text" : type}
          InputProps={
            isPassword
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(e) => e.preventDefault()}
                        edge="end" 
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  );
}
