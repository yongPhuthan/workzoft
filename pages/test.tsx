import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Box, Button, Container, TextField, Grid } from '@mui/material';
import { Hidden } from '@mui/material';
import QRCode from 'qrcode.react';
import { styled } from '@mui/system';
import { Typography } from '@mui/material';

// import { styled,createTheme } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';



const theme = createTheme({
    palette: {
      primary: {
        main: '#FF5A5F',
      },
      secondary: {
        main: '#ffffff',
      },
    },
  });
  
  const StyledContainer = styled(Container, {
    shouldForwardProp: (prop) => prop !== 'theme',
  })(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flexDirection: 'column',

    justifyContent: 'center',
    minHeight: '100vh',
  }));
  
  const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'theme',
  })(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.dark,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.dark,
      },
    },
    '& .MuiInputBase-input': {
      color: theme.palette.primary.main,
    },
    width: '100%', // setting the width to 80% of the parent container
  }));
  
  
  const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'theme',
  })(({ theme }) => ({
    backgroundColor: '#ec7211 !important', // change this line
    color: 'white', // change this line
    '&:hover': {
      backgroundColor: '#333 !important', // darker shade on hover
    },
  }));
  
  
  

const CompanySetting = () => {
  const { data: session, status } = useSession();
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const onSubmit = (data) => console.log(data);

  if (status === 'unauthenticated') {
    router.push('./firstlogin');
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <Hidden implementation="css" mdUp>
          {/* Mobile and Tablet View */}
          <StyledContainer maxWidth="sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                    
                  <StyledTextField
                    {...register('companyName')}
                    InputProps={{
                        startAdornment:<Box width="100px">
                        <span>ชื่อธุรกิจ: </span>
                      </Box>,
                        
                      }}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item>
                  <StyledTextField
                    {...register('companyServices')}
                    InputProps={{
                        startAdornment:<Box width="100px">
                        <span>บริการ: </span>
                      </Box>,
                        
                      }}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item>
                  <StyledTextField
                    {...register('tel')}
                    InputProps={{
                        startAdornment:<Box width="100px">
                        <span>มือถือ: </span>
                      </Box>,
                        
                      }}
                    variant="outlined"
                    fullWidth
                
                  />
                </Grid>
                <Grid item>
                  <StyledTextField
                    {...register('address')}
                    InputProps={{
                        startAdornment:<Box width="100px">
                        <span>ที่อยู่: </span>
                      </Box>,
                        
                      }}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item>
                  <StyledTextField
                    {...register('Line')}
                    InputProps={{
                        startAdornment:<Box width="100px">
                        <span>LINE: </span>
                      </Box>,
                        
                      }}
                    variant="outlined"
                    fullWidth
           
                  />
                </Grid>
                <Grid item>
                  <StyledTextField
                    {...register('email')}
                    InputProps={{
                        startAdornment:<Box width="100px">
                        <span>Email: </span>
                      </Box>,
                        
                      }}
                    variant="outlined"
              
              
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <StyledTextField
                    {...register('ownerName')}
        
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment:<Box width="100px">
                        <span>ชื่อเจ้าของ: </span>
                      </Box>,
                        
                      }}
         
                  />
                </Grid>
                <Grid item>
                  <StyledButton type="submit" variant="contained" fullWidth>
                    Save
                  </StyledButton>
                </Grid>
              </Grid>
            </form>
          </StyledContainer>
        </Hidden>
        <Hidden implementation="css" smDown>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
          >
            <Box mb={2}>Please scan this QR code on your mobile device:</Box>
            <QRCode value="https://reactjs.org/" size={256} />
          </Box>
          {/* Desktop View */}
          <div>Please scan this page on mobile</div>
          {/* QR Code Component */}
        </Hidden>
      </ThemeProvider>
    </>
  );
};

export default CompanySetting;
