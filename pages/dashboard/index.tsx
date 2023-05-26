// pages/Dashboard.tsx
import Grid from '@mui/material/Grid';
import { ProjectCard } from '../../components/DashBoard/ProjectCard';
import { AddProjectButton } from '../../components/DashBoard/AddProjectButton';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const projects = [
  { title: 'Project 1', description: 'Description for Project 1' },
  { title: 'Project 2', description: 'Description for Project 2' },
  // Add more projects as needed
];

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();
  if (status === 'unauthenticated') {
    // console.log('status', JSON.stringify(status))
    router.push('./register');
  }
  if (status === 'authenticated') {
    console.log('session.user.email', JSON.stringify(session));
  }

  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {projects.map((project, index) => (
          <Grid item xs={12} key={index}>
            <ProjectCard
              title={project.title}
              description={project.description}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <AddProjectButton />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
