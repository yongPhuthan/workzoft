import { useState } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height:'100vh',
  padding: theme.spacing(3),
  backgroundColor: '#f4f6f8',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ReviewPage = () => {
  const router = useRouter();
  const { id } = router.query; // get the id from the URL

  const [review, setReview] = useState('');
  const [rating, setRating] = useState(2.5);

  const handleSubmit = () => {
    // handle the submission logic here
  };

  return (
    <StyledContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Review {id}
      </Typography>
      <Rating
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
      <TextField
        variant="outlined"
        label="Your Review"
        multiline
        rows={4}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        fullWidth
        margin="normal"
      />
      <StyledButton variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </StyledButton>
    </StyledContainer>
  );
};

export default ReviewPage;
