import React from 'react';
import Button from '@mui/material/Button';
import styled from 'styled-components';

interface UploadButtonProps {
  text: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
}

const Input = styled.input`
  display: none;
`;

const StyledButton = styled(Button)`
  margin-right: 15px;
  background-color: #FF5A5F;
  color: white;
  &:hover {
    background-color: #FF5A5F;
  }
`;

const UploadButton: React.FC<UploadButtonProps> = ({ text, onChange, onClick }) => (
  <>
    {onChange ? (
      <>
        <Input
          id="contained-button-file"
   
          type="file"
          onChange={onChange}
        />
        <label htmlFor="contained-button-file">
          <StyledButton variant="contained">
            {text}
          </StyledButton>
        </label>
      </>
    ) : (
      <StyledButton variant="contained" onClick={onClick}>
        {text}
      </StyledButton>
    )}
  </>
);

export default UploadButton;
