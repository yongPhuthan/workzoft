// components/ProjectCard.tsx
import styled from "styled-components";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const StyledCard = styled(Card)({
  maxWidth: '80%',
  borderRadius: 12,
  boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#ffffff',
  margin: 'auto',
  marginBottom: '15px',
});

const StyledCardContent = styled(CardContent)({
  padding: '16px !important',
});



type ProjectCardProps = {
  title: string;
  description: string;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, description }) => (
<StyledCard>
    <StyledCardContent>
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </StyledCardContent>
  </StyledCard>
);

