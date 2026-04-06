import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

/**
 * Outlined password field with show/hide toggle. Forwards other TextField props.
 */
export default function PasswordField({ InputProps, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      autoComplete={props.autoComplete ?? 'current-password'}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={visible ? 'Hide password' : 'Show password'}
              onClick={() => setVisible((v) => !v)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
              size="small"
            >
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
