import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) throw new Error("No verification token provided");

        const response = await verifyEmail(token);
        setSuccess(response.message);
        setTimeout(() => navigate("/dashboard"), 3000);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, verifyEmail, navigate]);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Email Verification
      </Typography>

      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
          <Typography>Redirecting to dashboard...</Typography>
        </>
      )}

      {error && !loading && (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/register")}
        >
          Go to Registration
        </Button>
      )}
    </Box>
  );
};

export default VerifyEmail;
