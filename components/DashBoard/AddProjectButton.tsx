import styled from "styled-components";
import Button from '@mui/material/Button';

const StyledButton = styled(Button)({
    color: '#ffffff',
    backgroundColor: '#ff5a5f !important',
    '&:hover': {
      backgroundColor: '#ff7a85',
    },
    borderRadius: '4px',
    textTransform: 'none',
    fontSize: '1rem',
    margin: 'auto',
    display: 'block',
  });

export const AddProjectButton: React.FC = () => (
    <StyledButton variant="contained">Add Project</StyledButton>
    );