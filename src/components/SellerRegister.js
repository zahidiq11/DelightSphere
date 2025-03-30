import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SELLER_SECRET_KEY = "96274";

const SellerRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [frontIdLink, setFrontIdLink] = useState('');
  const [backIdLink, setBackIdLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUploading(true);
    
    // Validate all required fields
    if (!email || !password || !name || !phone || !shopName || !secretKey || !country) {
      setError('Please fill in all required fields');
      setIsUploading(false);
      return;
    }
    
    // Validate that password and country match
    if (password !== country) {
      setError('Password and confirm password must match exactly');
      setIsUploading(false);
      return;
    }
    
    // Validate secret key
    if (secretKey !== SELLER_SECRET_KEY) {
      setError('Invalid secret key');
      setIsUploading(false);
      return;
    }

    // Validate ID proof if document type is selected
    if (documentType && (!frontIdLink || !backIdLink)) {
      setError('Please provide both front and back ID proof image links');
      setIsUploading(false);
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Add seller details to Firestore
      await setDoc(doc(db, 'sellers', userCredential.user.uid), {
        name,
        email,
        phone,
        shopName,
        country,
        createdAt: new Date().toISOString(),
        role: 'seller',
        status: 'pending',
        approvalRequest: {
          status: 'pending',
          submittedAt: new Date().toISOString()
        },
        documentType: documentType || null,
        idProof: documentType ? {
          frontImage: frontIdLink,
          backImage: backIdLink
        } : null
      });

      setSuccess('Registration submitted! Waiting for admin approval. You will be notified via email.');
      setTimeout(() => {
        navigate('/seller/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Seller Registration
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Secret Key"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              helperText="Password must match exactly with the confirm Password field"
            />
            <TextField
              fullWidth
              label="confirm password"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              margin="normal"
              required
              helperText="confirm password must match exactly with the Password field"
            />

            <Box sx={{ mt: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Select ID Proof</FormLabel>
                <RadioGroup
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <FormControlLabel value="AADHAAR" control={<Radio />} label="Aadhaar Card" />
                  <FormControlLabel value="PASSPORT" control={<Radio />} label="Passport" />
                  <FormControlLabel value="DRIVING_LICENSE" control={<Radio />} label="Driving License" />
                  <FormControlLabel value="SSN" control={<Radio />} label="Social Security Card" />
                </RadioGroup>
              </FormControl>
            </Box>

            {documentType && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  ID Proof Image Links
                </Typography>
                <TextField
                  fullWidth
                  label="Front Side Image Link"
                  value={frontIdLink}
                  onChange={(e) => setFrontIdLink(e.target.value)}
                  margin="normal"
                  required
                  helperText="Enter the URL of the front side of your ID"
                />
                <TextField
                  fullWidth
                  label="Back Side Image Link"
                  value={backIdLink}
                  onChange={(e) => setBackIdLink(e.target.value)}
                  margin="normal"
                  required
                  helperText="Enter the URL of the back side of your ID"
                />
              </Box>
            )}

            <Box sx={{ mt: 3, position: 'relative' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isUploading}
                sx={{ height: 48 }}
              >
                {isUploading ? 'Processing...' : 'Register as Seller'}
              </Button>
              {isUploading && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>

            <Button
              fullWidth
              variant="text"
              sx={{ mt: 1 }}
              onClick={() => navigate('/seller/login')}
              disabled={isUploading}
            >
              Already have a seller account? Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SellerRegister; 