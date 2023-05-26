import React, { ChangeEvent, useState, useEffect } from 'react';
import { storage } from '../../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import styled from 'styled-components';
import useCreateCompany from '../../../hooks/useCreateCompany';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as pdfjsLib from 'pdfjs-dist';
import { makeStyles } from '@material-ui/core/styles';
import { Card as MuiCard, CardContent } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkIcon from '@mui/icons-material/Work';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Box,
  Button,
  Divider,
  Container,
  Select,
  FormControl,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputLabel,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
} from '@mui/material';
import { Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Radio, { RadioProps } from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Hidden } from '@mui/material';
import QRCode from 'qrcode.react';
import UploadButton from '../../../components/Buttons/UploadButton';
import UploadImage from '../../../components/Buttons/UploadImage';

const fetchCompanyData = async (email) => {
  const response = await fetch('/api/query/company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

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
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: auto;
  background-color: #f7f7f7;
`;

const StyledInput = styled.input`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #000000;
`;

const StyledButton = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 15px;
  border: none;
  background-color: black;
  color: white;
  width: 40vw;
  cursor: pointer;
`;

const BlackButton = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 20px;
  border: none;
  align-self: flex-end;
  background-color: black;
  color: white;
  width: 30vw;
  cursor: pointer;
  &:disabled {
    background-color: grey;
    color: white;
    cursor: not-allowed;
  }
`;
const WhiteButton = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 20px;
  border: 2;
  border-color: black;
  align-self: flex-end;
  background-color: white;
  color: black;
  width: 30vw;
  cursor: pointer;
`;

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow: 'inset 0 0 0 1px black', // make the outer circle black
  backgroundColor: 'white', // make the background white
  'input:hover ~ &': {
    backgroundColor: '#ddd', // change hover color if necessary
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: 'black', // make the outer circle black when checked
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(white, white 28%, transparent 32%)', // make the inner circle white
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#333', // change hover color when checked if necessary
  },
});
const StyledButtonCard = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #003d99;
  color: white;
  width: 85vw;
  cursor: pointer;
`;
const StyledFormLabel = styled(Typography)({
  color: 'black', // make the color black
  marginBottom: '30px', // add a bottom margin
  fontSize: '18px',
  fontWeight: 'bold',
});
const StyledTextFieldCard = styled.input`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const StyledTypographyCard = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 600;
  color: #474747;
`;

const StyledImageUpload = styled.img`
  margin: 10px;
  max-width: 500px;
  height: auto;
`;

const StyledCard = styled(MuiCard)`
  margin: 20px 0;
  width: 95vw;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 0;
  /* border-color: gray; */
`;
const StyledRoot = styled('div')({
  fontFamily:
    "Circular, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
  lineHeight: '1.43',
  color: '#484848',
  backgroundColor: '#fafafa',
  padding: '24px',
  height: '100vh',
});

const StyledImage = styled('img')({
  height: '100px',
  width: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginRight: '16px',
  position: 'relative',
});

const StyledTypography = styled(Typography)`
  &.title {
    fontsize: 14;
    color: '#484848';
  }
  &.pos {
    marginbottom: 12;
  }
`;

interface IFormInput {
  productDetails: Array<{ key: string; value: string; icon: string }>;
  productImages: Array<{ name: string; src: string }>;
  additionalProductImages: Array<{ name: string; src: string }>;
}
const StyledCloseIcon = styled(CloseIcon)({
  color: '#fff',
  backgroundColor: '#f44336', // Red background color
  borderRadius: '50%', // Round shape
});

const iconComponents = {
  Home: <HomeIcon />,
  Settings: <SettingsIcon />,
  Work: <WorkIcon />,
  // add more icons as per your requirement
};
// We also create a list of icon names for the Select dropdown
const iconNames = Object.keys(iconComponents);

const StyledContainer = styled(Container)`
  background-color: ${theme.palette.secondary.main};
  padding: ${theme.spacing(3)};
  border-radius: ${theme.shape.borderRadius};
  display: flex;
  overflow: auto;
  width: 100vw;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    fieldset {
      border-color: ${theme.palette.primary.main};
    }
    &:hover fieldset {
      border-color: ${theme.palette.primary.dark};
    }
    &.Mui-focused fieldset {
      border-color: ${theme.palette.primary.dark};
    }
  }
  .MuiInputBase-input {
    color: ${theme.palette.primary.main};
  }
  width: 100%;
`;

function BpRadio(props: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

const CardForm = ({
  defaultValues,
  handleContinue,
  setCardFormSubmitted,
  setShowForm,
  handleBack,
  selectedValue,
  setCardFormData,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { register, handleSubmit, control, watch } = useForm({ defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projectDescription',
  });
  const { updateCard, isLoading, error } = useCreateCompany(
    session?.user?.email
  );
  if (status === 'unauthenticated') {
    router.push('./firstlogin');
  }
  if (status === 'authenticated') {
    console.log('session.user.email', JSON.stringify(session));
  }

  const onSubmit = (data) => {
    console.log('data', data);
    setCardFormSubmitted(true);
    setShowForm(false);
    handleContinue();
    setCardFormData(data);
  };

  return (
    <ThemeProvider theme={theme}>
      <Hidden implementation="css" mdUp>
        {/* Mobile and Tablet View */}
        <StyledContainer maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            {selectedValue == 'upload' ? (
              <>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Grid sx={{ marginBottom: 5 }} item>
                      <Grid container justifyContent="space-between">
                        <Grid>
                          <StyledTypographyCard>
                            ชื่อโครงการ
                          </StyledTypographyCard>
                        </Grid>
                      </Grid>

                      <StyledTextField
                        {...register(`projectTitle`)}
                        variant="outlined"
                        value={watch('projectTitle')}
                        fullWidth
                        multiline
                        rows={1}
                      />
                    </Grid>
                    {/* <StyledButtonCard type="button" onClick={() => append({ value: '' })}>
                Add
              </StyledButtonCard> */}
                  </Grid>
                </Grid>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    {fields.map((field, index) => (
                      <Grid sx={{ marginBottom: 5 }} item key={field.id}>
                        <Grid container justifyContent="space-between">
                          <Grid>
                            <StyledTypographyCard>
                              รายละเอียด
                            </StyledTypographyCard>
                          </Grid>
                          {/* <Grid>
                        <HighlightOffIcon
                          sx={{ color: 'red', marginBottom: 1 }}
                          onClick={() => remove(index)}
                          fontSize="large"
                        />
                      </Grid> */}
                        </Grid>

                        <StyledTextField
                          {...register(`projectDescription[${index}]`)}
                          defaultValue={`projectDescription${index}.value`} // set default value
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={7}
                        />
                      </Grid>
                    ))}
                    {/* <StyledButtonCard type="button" onClick={() => append({ value: '' })}>
                Add
              </StyledButtonCard> */}
                  </Grid>
                  <Grid container justifyContent={'space-between'}>
                    <Grid item>
                      <Box p={2} mt={2} sx={{ alignSelf: 'flex-start' }}>
                        <Button
                          startIcon={
                            <ArrowBackIcon
                              sx={{ color: 'black', fontSize: 'large' }}
                            />
                          }
                          onClick={handleBack}
                          sx={{ color: 'black', fontSize: 'large' }}
                        >
                          ย้อนกลับ
                        </Button>
                      </Box>
                    </Grid>
                    <Grid mt={2} item>
                      <BlackButton type="submit">ไปต่อ</BlackButton>
                      {/* <StyledButtonCard type="submit">Save</StyledButtonCard> */}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Grid sx={{ marginBottom: 5 }} item>
                      <Grid container justifyContent="space-between">
                        <Grid>
                          <StyledTypographyCard>
                            ชื่อโครงการ
                          </StyledTypographyCard>
                        </Grid>
                      </Grid>

                      <StyledTextField
                        {...register(`projectTitleManual`)}
                        variant="outlined"
                        value={watch(`projectTitleManual`)}
                        fullWidth
                        multiline
                        rows={1}
                      />
                    </Grid>
                    {/* <StyledButtonCard type="button" onClick={() => append({ value: '' })}>
                Add
              </StyledButtonCard> */}
                  </Grid>
                </Grid>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Grid sx={{ marginBottom: 5 }} item>
                      <Grid container justifyContent="space-between">
                        <Grid>
                          <StyledTypographyCard>
                            รายละเอียด
                          </StyledTypographyCard>
                        </Grid>
                      </Grid>

                      <StyledTextField
                        {...register(`projectDescriptionManual`)}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={7}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent={'space-between'}>
                    <Grid item>
                      <Box p={2} mt={2} sx={{ alignSelf: 'flex-start' }}>
                        <Button
                          startIcon={
                            <ArrowBackIcon
                              sx={{ color: 'black', fontSize: 'large' }}
                            />
                          }
                          onClick={handleBack}
                          sx={{ color: 'black', fontSize: 'large' }}
                        >
                          ย้อนกลับ
                        </Button>
                      </Box>
                    </Grid>
                    <Grid mt={2} item>
                      <BlackButton type="submit">ไปต่อ</BlackButton>
                      {/* <StyledButtonCard type="submit">Save</StyledButtonCard> */}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
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

const ProductDetailsForm = (props: any) => {
  const cardFormData = props.cardFormData;
  const [open, setOpen] = React.useState(false);
  const [dialogImage, setDialogImage] = React.useState('');
  const { data: session, status } = useSession();
  const [companyId, setCompanyId] = useState('');
  const [email, setEmail] = useState('');
  const watermark = 'doubledoor';
  const [isLoading, setIsLoading] = React.useState(false);

  const [productImagesUrls, setProductImagesUrls] = React.useState('');
  const [additionalProductImagesUrls, setAdditionalProductImagesUrls] =
    React.useState('');

  const onImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // you might want to handle validation here

    files.forEach((file, index) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        appendImage({ name: file?.name, src: reader.result });
      };

      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const getSessionEmail = async () => {
      if (session && session.user && session.user.email) {
        setEmail(session.user.email);
      }
    };

    getSessionEmail();
  }, []);

  const { data: companyData, status: companyStatus } = useQuery(
    ['company', email], // Provide a unique key for the query
    () => fetchCompanyData(email) // Fetch function
  );

  const onImageUploadAfter = (e, appendImageFunction) => {
    const files = Array.from(e.target.files);

    // you might want to handle validation here

    files.forEach((file, index) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        appendImageFunction({ name: file.name, src: reader.result });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleClickOpen = (imageUrl) => {
    setDialogImage(imageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { register, control, handleSubmit, watch } = useForm<IFormInput>({
    defaultValues: {
      productDetails: [{ key: '', value: '', icon: 'Home' }],
      productImages: [],
      additionalProductImages: [],
    },
  });
  const watchAllFields = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productDetails',
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'productImages',
  });
  const {
    fields: additionalImageFields,
    append: appendAdditionalImage,
    remove: removeAdditionalImage,
  } = useFieldArray({
    control,
    name: 'additionalProductImages',
  });

  useEffect(() => {
    if (companyStatus === 'success' && companyData) {
      setCompanyId(companyData._id);
    }
  }, [cardFormData, companyStatus, companyData]);

  console.log('company ID', companyId);
  const onSubmit = (data) => {
    console.log('data', data);
    // Add this line
  };

  const addWatermarkText = (imageSrc, watermarkText) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scaleFactor = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const watermarkWidthRatio = 0.3; // Ratio of the watermark width to the image width
        const watermarkHeightRatio = 0.1; // Ratio of the watermark height to the image height
        const watermarkColor = 'rgba(128, 128, 128, 0.6)'; // Gray background color with increased transparency
        const watermarkTextColor = '#fbfbfb';
        const watermarkFontSizeRatio = 0.02; // Ratio of the watermark font size to the image height

        const watermarkWidth = Math.floor(canvas.width * watermarkWidthRatio);
        const watermarkHeight = Math.floor(
          canvas.height * watermarkHeightRatio
        );
        const watermarkFontSize = Math.floor(
          canvas.height * watermarkFontSizeRatio
        );

        const watermarkX = canvas.width - watermarkWidth - 10; // X-coordinate of the watermark
        const watermarkY = (canvas.height - watermarkHeight) / 1.5; // Y-coordinate of the watermark

        ctx.fillStyle = watermarkColor;
        ctx.fillRect(watermarkX, watermarkY, watermarkWidth, watermarkHeight);

        ctx.font = `${watermarkFontSize}px Arial`;
        ctx.fillStyle = watermarkTextColor;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left'; // Set the text alignment to left
        ctx.fillText(
          watermarkText,
          watermarkX + 15, // Adjust the x-coordinate for padding
          watermarkY + watermarkHeight / 2
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create a blob.'));
            }
          },
          'image/jpeg',
          1
        );
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = imageSrc;
    });
  };

  const dataUrlToBlob = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const onSaveTodatabase = async (data) => {
    setIsLoading(true);

    // Upload images to Firebase Storage and get download URLs
    await Promise.all(
      (data?.productImages || []).map(async (image) => {
        const storageRef = ref(storage, `images/projects/${image.name}`);
        const blob = await addWatermarkText(image.src, watermark);

        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              console.log(error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setAdditionalProductImagesUrls(downloadURL);
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            }
          );
        });
      })
    );

    await Promise.all(
      (data?.additionalProductImages || []).map(async (image) => {
        const storageRef = ref(storage, `images/projects/${image.name}`);
        const blob = dataUrlToBlob(image.src);

        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              console.log(error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setAdditionalProductImagesUrls(downloadURL);
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            }
          );
        });
      })
    );

    if (productImagesUrls && additionalProductImagesUrls !== '') {
      const mongodbData = {
        productImagesUrls,
        additionalProductImagesUrls,
        cardFormData: cardFormData,
        email: session.user.email,
      };
      // Post data to API
      try {
        const response = await fetch('/api/projects/saveToDatabase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: mongodbData }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();
        console.log(jsonResponse.message);
      } catch (error) {
        console.error(
          'There has been a problem with your fetch operation:',
          error
        );
      }
    }
    setIsLoading(false);
  };
  console.log('props.selectedValue ', props.selectedValue);
  return (
    <StyledRoot>
      <Box mb={-1} pl={2} mt={3}>
        <Typography variant="h6" fontWeight={'bold'}>
          สรุปรายการ
        </Typography>
      </Box>
      {props.selectedValue == 'manual' ? (
        <StyledCard variant="outlined">
          <CardContent>
            <Typography variant="body1">
              {cardFormData?.projectTitleManual}
            </Typography>
            <StyledTypography className="pos" color="textSecondary">
              {cardFormData?.projectDescriptionManual}
            </StyledTypography>
            <Typography variant="body2" component="p">
              Expires: {cardFormData?.expiryDate}
            </Typography>
          </CardContent>
        </StyledCard>
      ) : (
        <StyledCard variant="outlined">
          <CardContent>
            <Typography variant="body1">
              {cardFormData?.projectTitle}
            </Typography>
            <StyledTypography className="pos" color="textSecondary">
              5555 {cardFormData?.projectDescription[0]}
            </StyledTypography>
            <Typography variant="body2" component="p">
              Expires: {cardFormData?.expiryDate}
            </Typography>
          </CardContent>
        </StyledCard>
      )}

      <StyledCard variant="outlined" sx={{ padding: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <Grid
              container
              key={field.id}
              mb={2}
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={5.5}>
                <Box>
                  <FormControl size="small" fullWidth sx={{ border: 'none' }}>
                    {/* <InputLabel id={`icon-label-${index}`}>Icon</InputLabel> */}
                    <Controller
                      name={`productDetails.${index}.icon` as const}
                      control={control}
                      defaultValue={field.icon}
                      render={({ field }) => (
                        <Select labelId={`icon-label-${index}`} {...field}>
                          {iconNames.map((iconName) => (
                            <MenuItem value={iconName} key={iconName}>
                              {iconComponents[iconName]}
                              {iconName}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={5.5}>
                <Box>
                  <TextField
                    size="small"
                    {...register(`productDetails.${index}.value` as const)}
                    placeholder="ex 20 cm"
                    defaultValue={field.value}
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid item xs={1}>
                <IconButton type="button" onClick={() => remove(index)}>
                  <RemoveIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            sx={{ marginBottom: 1, marginTop: 2 }}
            onClick={() => append({ key: '', value: '', icon: 'Home' })}
            variant="outlined"
            component="label"
            startIcon={<AddIcon />}
          >
            เพิ่มไอคอน
          </Button>

          {/* <Button type="submit">Submit</Button> */}
        </form>
      </StyledCard>

      <StyledCard variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="h6" fontWeight={'bold'}>
          เพิ่มรูปภาพผลงาน
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Display uploaded images */}
            <Grid container>
              {imageFields.map((field, index) => (
                <Grid item mt={2} xs={4} key={index}>
                  <Box key={index} position="relative">
                    <StyledImage
                      src={field.src}
                      alt={field.name}
                      onClick={() => handleClickOpen(field.src)}
                    />
                    <IconButton
                      onClick={() => removeImage(index)}
                      size="small"
                      style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <StyledCloseIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={3}>
                <Button
                  component="label"
                  sx={{
                    width: '100px',
                    height: '100px',
                    marginTop: 2,
                    backgroundColor: '#fff',
                    border: '1px dotted #ccc',
                    display: 'flex',
                    borderRadius: '5px',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <AddIcon color="primary" fontSize="large" />
                  <Typography variant="subtitle1">เพิ่มรูปภาพ</Typography>
                  <input
                    type="file"
                    onChange={onImageUpload}
                    hidden
                    multiple
                    accept="image/*"
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Dialog for larger image */}
          <Dialog
            open={open}
            onClose={handleClose}
            scroll={'body'}
            maxWidth={'lg'}
            fullWidth
          >
            <DialogContent>
              <img
                src={dialogImage}
                alt=""
                style={{ width: '100%', height: 'auto' }}
              />
            </DialogContent>
          </Dialog>
        </form>
      </StyledCard>

      <StyledCard variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="h6" fontWeight={'bold'}>
          ภาพหน้างานก่อนติดตั้ง
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Display uploaded images */}
            <Grid container>
              {additionalImageFields.map((field, index) => (
                <Grid item mt={2} xs={4} key={index}>
                  <Box key={index} position="relative">
                    <StyledImage
                      src={field.src}
                      alt={field.name}
                      onClick={() => handleClickOpen(field.src)}
                    />
                    <IconButton
                      onClick={() => removeAdditionalImage(index)}
                      size="small"
                      style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <StyledCloseIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={3}>
                <Button
                  component="label"
                  sx={{
                    width: '100px',
                    height: '100px',
                    marginTop: 2,
                    backgroundColor: '#fff',
                    border: '1px dotted #ccc',
                    display: 'flex',
                    borderRadius: '5px',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <AddIcon color="primary" fontSize="large" />
                  <Typography variant="subtitle1">เพิ่มรูปภาพ</Typography>
                  <input
                    type="file"
                    onChange={(e) =>
                      onImageUploadAfter(e, appendAdditionalImage)
                    }
                    hidden
                    multiple
                    accept="image/*"
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* <Button variant="contained" component="label">
            Upload Additional Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e) => onImageUploadAfter(e, appendAdditionalImage)}
            />
          </Button>

          <Box display="flex" flexDirection="row" marginTop={2}>
            {additionalImageFields.map((field, index) => (
              <Box key={index} position="relative">
                <StyledImage
                  src={field.src}
                  alt={field.name}
                  onClick={() => handleClickOpen(field.src)}
                />
                <IconButton
                  onClick={() => removeAdditionalImage(index)}
                  size="small"
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >
                  <StyledCloseIcon fontSize="inherit" />
                </IconButton>
              </Box>
            ))}
          </Box> */}

          {/* Dialog for larger image */}
          <Dialog
            open={open}
            onClose={handleClose}
            scroll={'body'}
            maxWidth={'md'}
            fullWidth
          >
            <DialogContent>
              <img
                src={dialogImage}
                alt=""
                style={{ width: '100%', height: 'auto' }}
              />
            </DialogContent>
          </Dialog>
        </form>
      </StyledCard>

      <Grid container justifyContent={'space-between'}>
        <Grid item>
          <Box p={2} sx={{ alignSelf: 'flex-start' }}>
            <Button
              startIcon={
                <ArrowBackIcon sx={{ color: 'black', fontSize: 'large' }} />
              }
              onClick={props.handleBack}
              sx={{ color: 'black', fontSize: 'large' }}
            >
              ย้อนกลับ
            </Button>
          </Box>
        </Grid>
        <Box mb={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BlackButton
            disabled={!imageFields.length || isLoading}
            onClick={() => onSaveTodatabase(watchAllFields)}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} />
                Saving...
              </>
            ) : (
              'บันทึก'
            )}
          </BlackButton>
        </Box>
      </Grid>
    </StyledRoot>
  );
};

const CompanySetting: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isCardFormSubmitted, setCardFormSubmitted] = useState(false);
  const [cardFormData, setCardFormData] = useState({}); // Add this line
  const [uploadPage, setUploadPage] = useState(false);
  const [selectChoice, setSelectChoice] = useState('uploadPDF');
  const [selectedValue, setSelectedValue] = useState('upload');
  const [step, setStep] = useState(1);

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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleChange');
    setSelectedValue((event.target as HTMLInputElement).value);
  };

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  const handleContinueManual = () => {
    if (step < 4) {
      setStep(step + 2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const handleBackManual = () => {
    if (step > 1) {
      setStep(step - 2);
    }
  };
  const performOCR = async (base64ImageContent: string) => {
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64ImageContent }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log('OCR results: ', data);

      const fullText = data[0].description;
      console.log('full text: ', fullText);

      const lines = fullText.split('\n');
      console.log('lines: ', lines);

      const descriptions = lines[0];
      const projectCheck = ['ประตู', 'กระจก']; // Replace these with your words
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

      const website = lines.filter((line) => line.includes('www'))[0];
      const email = lines.filter((line) => line.includes('@'))[0];

      const projectOCR = lines.filter((line) =>
        projectCheck.some((word) => line.includes(word))
      );

      const projectDescription = projectOCR.join('\n'); // Join the lines with a newline character
      setDefaultValues({
        projectDescription: projectDescription.split('\n\n'), // Split into array

        website,
      });
      setStep(3);
    } catch (error) {
      console.error('Error performing OCR', error);
    }
  };

  const handleOcrUpload = async () => {
    if (!file) return;

    try {
      // Check the file format
      if (file.type === 'application/pdf') {
        // It's a PDF. Convert to image then perform OCR
        const pdfjs = await import('pdfjs-dist/build/pdf');

        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        const pdf = await pdfjsLib.getDocument({
          url: URL.createObjectURL(file),
        }).promise;
        const page = await pdf.getPage(1); // we only process the first page

        const scale = 1;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const base64Image = canvas.toDataURL('image/jpeg', 1.0);
        const base64ImageContent = base64Image.replace(
          /^data:image\/(png|jpeg);base64,/,
          ''
        );

        await performOCR(base64ImageContent);
      } else if (file.type.startsWith('image/')) {
        // It's an image. Perform OCR directly
        const reader = new FileReader();
        reader.onloadend = async function () {
          const base64data = reader.result;
          if (base64data) {
            const base64ImageContent = (base64data as string).split(',')[1];
            await performOCR(base64ImageContent);
          } else {
            console.error('Failed to read the file.');
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Unsupported file type.');
      }
    } catch (error) {
      console.error('Error in handleOcrUpload', error);
    }
  };
  console.log('selected value', selectedValue);
  return (
    <PageContainer>
      {step === 2 && selectedValue == 'upload' ? (
        <>
          <Typography mb={4} variant="h6">
            เลือกไฟล์ใบเสนอราคาเพื่ออัพโหลด
          </Typography>

          <StyledInput type="file" onChange={onFileChange} />

          <StyledButton onClick={handleOcrUpload}>อัพโหลด</StyledButton>
          <Box p={2} mt={2} sx={{ alignSelf: 'flex-start' }}>
            <Button
              startIcon={
                <ArrowBackIcon sx={{ color: 'black', fontSize: 'large' }} />
              }
              onClick={handleBack}
              sx={{ color: 'black', fontSize: 'large' }}
            >
              ย้อนกลับ
            </Button>
          </Box>

          {url && <StyledImage src={url} alt="Uploaded file" />}
        </>
      ) : step === 2 && selectedValue == 'manual' ? (
        <CardForm
          handleContinue={handleContinueManual}
          handleBack={handleBack}
          selectedValue={selectedValue}
          defaultValues={defaultValues}
          setCardFormSubmitted={setCardFormSubmitted}
          setShowForm={setShowForm}
          setCardFormData={setCardFormData}
        />
      ) : (
        ''
      )}

      {step === 3 && (
        <CardForm
          handleContinue={handleContinue}
          handleBack={handleBack}
          selectedValue={selectedValue}
          defaultValues={defaultValues}
          setCardFormSubmitted={setCardFormSubmitted}
          setShowForm={setShowForm}
          setCardFormData={setCardFormData}
        />
      )}
      {step === 4 && selectedValue == 'manual' ? (
        <ProductDetailsForm
          handleBack={handleBackManual}
          selectedValue={selectedValue}
          cardFormData={cardFormData}
        />
      ) : step === 4 && selectedValue == 'upload' ? (
        <ProductDetailsForm
          handleBack={handleBack}
          selectedValue={selectedValue}
          cardFormData={cardFormData}
        />
      ) : (
        ''
      )}
      {step === 1 && (
        <FormControl sx={{ padding: 3 }}>
          <StyledFormLabel id="demo-customized-radios">
            เลือกวิธีการเพิ่มผลงาน
          </StyledFormLabel>
          <RadioGroup
            defaultValue={selectedValue}
            aria-labelledby="demo-customized-radios"
            name="customized-radios"
            onChange={handleChange}
          >
            <Box mb={2}>
              <FormControlLabel
                value="upload"
                control={<BpRadio />}
                label={
                  <Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1">
                        อัพโหลดใบเสนอราคา (แนะนำ)
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="textSecondary">
                      ใช้ระบบพิมพ์รายละเอียดผลงานอัตโนมัติจากการอัพโหลดใบเสนอราคา
                      สะดวกกว่า เร็วกว่า
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <FormControlLabel
              value="manual"
              control={<BpRadio />}
              label={
                <Box>
                  <Typography variant="body1">
                    เพิ่มรายละเอียดด้วยตัวเอง
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  ></Typography>
                </Box>
              }
            />
          </RadioGroup>
          <Box mt={5} alignSelf={'flex-end'}>
            <BlackButton onClick={handleContinue}>เริ่มต้น</BlackButton>
          </Box>
        </FormControl>
      )}
    </PageContainer>
  );
};

export default CompanySetting;
