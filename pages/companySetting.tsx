import React, { ChangeEvent, useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useForm } from 'react-hook-form';
import { styled } from '@mui/system';
import useCreateCompany from '../hooks/useCreateCompany';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import {
  Box,
  Button,
  Container,
  TextField,
  Grid,
} from '@mui/material';
import { Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Hidden } from '@mui/material';
import QRCode from 'qrcode.react';
import BlackButton from '../components/Buttons/BlackButton';
import LogOutButton from '../components/Buttons/LogOutButton';
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
      borderColor: '#ddd',
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

const CardForm = ({ defaultValues }) => {
  const { data: session, status } = useSession();
  const [watermarkType, setWatermarkType] = useState('watermarktester');
  const router = useRouter();

  const { register, handleSubmit } = useForm({ defaultValues });
  if (status === 'unauthenticated') {
    router.push('./firstlogin');
  }
  if (status === 'authenticated') {
    console.log('session.user.email', JSON.stringify(session));
  }
  const { updateCard, isLoading, error } = useCreateCompany(
    session?.user?.email
  );

  const onSubmit = (data) => {
    console.log(data);
    updateCard(data);
  };
  return (
    <ThemeProvider theme={theme}>
      <Hidden implementation="css" mdUp>
        {/* Mobile and Tablet View */}
        <StyledContainer maxWidth="sm">
          <Box mb={2} pl={2} mt={3}>
            <Typography variant="h6" fontWeight={'bold'}>
              เพิ่มข้อมูลธุรกิจ
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <StyledTextField
                  {...register('companyName')}
                  InputProps={{
                    startAdornment: (
                      <Box width="100px">
                        <span>ชื่อธุรกิจ: </span>
                      </Box>
                    ),
                  }}
                  variant="outlined"
                  placeholder="ชื่อร้านของคุณ"
                  fullWidth
                  multiline
                  rows={1}
                />
              </Grid>
              <Grid item>
                <StyledTextField
                  {...register('companyServices')}
                  InputProps={{
                    startAdornment: (
                      <Box width="100px">
                        <span>บริการ: </span>
                      </Box>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  multiline
                  placeholder="คุณให้บริการอะไรบ้าง เช่นรับติดตั้ง...."
                  rows={2}
                />
              </Grid>
              <Grid item>
                <StyledTextField
                  {...register('mobile1')}
                  InputProps={{
                    startAdornment: (
                      <Box width="100px">
                        <span>มือถือ: </span>
                      </Box>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <StyledTextField
                  {...register('address')}
                  InputProps={{
                    startAdornment: (
                      <Box width="100px">
                        <span>ที่อยู่: </span>
                      </Box>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  placeholder='ที่อยู่ร้านของคุณ'
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item>
                <StyledTextField
                  {...register('line')}
                  InputProps={{
                    startAdornment: (
                      <Box width="100px">
                        <span>LINE: </span>
                      </Box>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  placeholder='ไอดีไลน์ของคุณ'
                />
              </Grid>
              {/* <Grid item>
                <StyledTextField
                  {...register('email')}
                  InputProps={{
                    startAdornment: (
                      <Box width="100px">
                        <span>Email: </span>
                      </Box>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid> */}
              {/* <Grid item>
                <StyledTextField
                  {...register('ownerName')}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <Box width="120px">
                        <span>ชื่อเจ้าของ: </span>
                      </Box>
                    ),
                  }}
                />
              </Grid> */}
            </Grid>
            {/* WaterMark */}
            {/* <Grid item>
              <InputLabel id="watermark-type-label">Watermark Type</InputLabel>
              <Select
                labelId="watermark-type-label"
                value={watermarkType}
                onChange={(e) => setWatermarkType(e.target.value)}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="logo">Logo</MenuItem>
              </Select>
            </Grid>
            {watermarkType === 'text' ? (
  <Grid item>
    <StyledTextField
      {...register('watermarkText')}
      variant="outlined"
      fullWidth
      InputProps={{
        startAdornment: (
          <Box width="120px">
            <span>Watermark Text: </span>
          </Box>
        ),
      }}
    />
  </Grid>
) : (
  <Grid item>
    <input 
      type="file" 
      accept="image/*" 
      {...register('watermarkLogo')}
      onChange={(e) => {
        // handle file upload
        const file = e.target.files[0];
        if (file) {
          const fileSize = file.size / 1024 / 1024; // size in MB
          const fileType = file.type; // MIME type of the file
          
          // Check if the file is an image
          if (!fileType.startsWith('image/')) {
            alert("Please upload an image file.");
            return;
          }
      
          // Check if the file size is less than 1MB
          if (fileSize > 1) {
            alert("Please upload a file of size less than 1MB.");
            return;
          }
      
          // At this point, the file is an image and its size is less than 1MB.
          // Now, you can handle the file upload as per your requirements.
        }
      }}
      
    />
  </Grid>
)} */}
            <Grid item mt={2}>
              <BlackButton
                disabled={isLoading}
                isLoading={isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                บันทึก
              </BlackButton>
            </Grid>
            <LogOutButton />
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
  );
};

const CompanySetting: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const { data: session, status } = useSession();
  const router = useRouter();

  const [url, setUrl] = useState<string | null>(null);
  if (status === 'unauthenticated') {
    router.push('./firstlogin');
  }
  if (status === 'authenticated') {
    console.log('session.user.email', JSON.stringify(session));
  }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    setFile(e.target.files[0]);
  };
  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);
        setUrl(downloadURL);

        // Save image URL to MongoDB Atlas
        try {
          const response = await fetch('/api/saveImageUrl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: downloadURL }),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const { data } = await response.json();
          console.log('Image URL saved: ', data);
        } catch (error) {
          console.error('Error saving image URL to the database', error);
        }
      }
    );
  };

  const handleOcrUpload = async () => {
    try {
      const reader = new FileReader();
      reader.onloadend = async function () {
        const base64data = reader.result;
        if (base64data) {
          const base64Image = (base64data as string).split(',')[1];
          const response = await fetch('/api/ocr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image }),
          });
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const data = await response.json();
          console.log('OCR results: ', data);

          const fullText = data[0].description;
          console.log('full text: ', fullText);

          const lines = fullText.split('\n');
          // const [firstName, lastName] = lines[0].split(" ");
          const companyName = lines[0];
          const mbileCheck = ['09', '08']; // Replace these with your words
          const addressToCheck = [
            'เลขที่',
            'อาคาร',
            'ชั้น',
            'ถนน',
            'ตำบล',
            'เขต',
            'แขวง',
          ]; // Replace these with your words
          const lineToCheck = ['line', 'LINE', 'Line', 'ถนน']; // Replace these with your words
          const nameToCheck = ['คุณ', 'นาย', 'นาง', 'นางสาว', 'ช่าง']; // Replace these with your words
          const serviceToCheck = ['บริการ', 'ติดตั้ง', 'รับ', 'ซ่อม', 'ล้าง']; // Replace these with your words

          const [mobileWithExtraChars1, mobileWithExtraChars2] =
            lines
              .filter((line) =>
                mbileCheck.some((word) => line.includes(word))
              )[0]
              ?.split(' ') || ''; // Gets all lines that include any of the words

          const mobile1 = mobileWithExtraChars1.replace(/\D/g, '');
          const mobile2 = mobileWithExtraChars2?.replace(/\D/g, ''); // Replace all non-digits with nothing

          const website = lines.filter((line) => line.includes('www'))[0];
          const email = lines.filter((line) => line.includes('@'))[0];

          const addressLines = lines.filter((line) =>
            addressToCheck.some((word) => line.includes(word))
          ); // Gets all lines that include any of the words
          const address = addressLines.join('\n'); // Join the lines with a newline character
          const lineLine = lines.filter((line) =>
            lineToCheck.some((word) => line.includes(word))
          );
          const lineName = lines.filter((line) =>
            nameToCheck.some((word) => line.includes(word))
          );
          const serviceName = lines.filter((line) =>
            serviceToCheck.some((word) => line.includes(word))
          );

          const line = lineLine.join('\n').replace('LINE', '');
          const ownerName = lineName.join('\n'); // Join the lines with a newline character
          const companyServices = serviceName.join('\n');
          setDefaultValues({
            companyName,
            companyServices,
            mobile1,
            mobile2,
            website,
            address,
            line,
            email,
            ownerName,
          });
          setShowForm(true);
        } else {
          console.error('Failed to read the file.');
        }
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error performing OCR', error);
    }
  };

  return (
    <div>
      {/* <input type="file" onChange={onFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleOcrUpload}>OCR Upload</button>
      {url && <img src={url} alt="Uploaded file" />}

      {showForm && <CardForm defaultValues={defaultValues} />} */}

      <CardForm defaultValues={defaultValues} />
    </div>
    // <ThemeProvider theme={theme}>
    //   <StyledContainer maxWidth="sm">
    //     <Box
    //       display="flex"
    //       justifyContent="center"
    //       alignItems="center"
    //       flexDirection="column"
    //       mt={3}
    //     >
    //       <input
    //         accept="image/*"
    //         style={{ display: 'none' }}
    //         id="icon-button-file"
    //         type="file"
    //         onChange={onFileChange}
    //       />
    //       <label htmlFor="icon-button-file">
    //         <StyledIconButton onClick={handleOcrUpload}>
    //           <PhotoCamera style={{ fontSize: 50 }} />
    //         </StyledIconButton>
    //       </label>
    //       <Typography variant="body1" color="primary">
    //         Upload Image
    //       </Typography>
    //     </Box>
    //   </StyledContainer>
    // </ThemeProvider>
  );
};

export default CompanySetting;
