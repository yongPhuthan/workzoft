import React, { useState } from 'react';
import { Box } from '@mui/material';
import styled from 'styled-components';

const Input = styled.input`
  display: none;
`;

const StyledBox = styled(Box)`
  height: 400px;
  width: 100vw;
  position: relative;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

interface UploadImageProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onChange }) => {
  const defaultImage = '/path/to/your/default/image.jpg'; // Replace with your default image path
  const [preview, setPreview] = useState(defaultImage);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(defaultImage);
    }
    onChange && onChange(event);
  };

  return (
    <>
      <Input
        accept="image/*"
        id="icon-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="icon-button-file">
        <StyledBox
          style={{ backgroundImage: `url(${preview})` }}
        />
      </label>
    </>
  );
};

export default UploadImage;
