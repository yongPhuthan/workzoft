import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import { signOut, useSession } from 'next-auth/react';

const ButtonBlack = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 20px;
  border: none;
  align-self: flex-end;
  background-color: black;
  color: white;
  width: 90vw;
  cursor: pointer;
  &:disabled {
    background-color: grey;
    color: white;
    cursor: not-allowed;
  }
`;

const WhiteCircularProgress = styled(CircularProgress)`
  color: white;
`;

type Props = {
  disabled: boolean;
  isLoading: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode; // add this line
};

const LogOutButton = () => {
  return (
    <Box mb={4} sx={{ display: 'flex', justifyContent: 'center' }}>
      <ButtonBlack onClick={() => signOut()}>Log out</ButtonBlack>
    </Box>
  );
};

export default LogOutButton;
