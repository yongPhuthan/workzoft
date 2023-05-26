import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { TextField, Grid, Button, Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import BlackButton from '../components/Buttons/BlackButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: white;
  /* background: linear-gradient(to bottom, #6D5BBA, #FFFFFF); */
  font-family: 'Poppins', sans-serif;
`;

const SubdomainInput = styled.input`
  border: none;
  border-radius: 25px;
  padding: 10px;
  margin-right: 10px;
  outline: none;
  flex: 1;
  font-family: 'Poppins', sans-serif;
`;

const SubdomainText = styled.span`
  color: #484848;
  margin-left: 10px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid black;
  padding: 10px;
  border-radius: 25px;
  background-color: #fff;
  /* box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1); */
  margin-bottom: 20px;
`;

const SubdomainButton = styled.button`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  color: white;
  border: none;
  width: '50%';
  border-radius: 25px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #ff7a78;
  }
`;

const Welcome = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [pageExists, setPageExists] = useState<string | null>(null);
  const [searchState, setSearchState] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const pageToSearch = watch('pageToSearch');

  useEffect(() => {
    if (searchState) {
      setSearchState('');
      setPageExists(null);
    }
  }, [pageToSearch, searchState]);

  const checkIfPageExists = async (data: any) => {
    setIsLoading(true);

    const pageToSearch = data.pageToSearch;
    if (pageToSearch) {
      setSearchState('SEARCHING');
      try {
        let res = await fetch(`/api/get-page?page=${pageToSearch}`);
        let resData = await res.json();
        if (res.status === 200) {
          setSearchState('ERROR');
          setPageExists(`${pageToSearch}.${process.env.NEXT_PUBLIC_Domain}`);
          return;
        }
        if (res.status === 404) {
          // Save page to collection
          let saveRes = await fetch(`/api/save-page`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: pageToSearch,
              html: '',
              sessionId: '',
            }), // Replace with actual values
          });
          if (saveRes.ok) {
            setIsLoading(false);
            router.push(`${process.env.NEXT_PUBLIC_BASE_URL}dashboard`);

            // router.push(`http://www.${pageToSearch}.${process.env.NEXT_PUBLIC_DOMAIN}dashboard`);
          } else {
            throw new Error('Error saving page');
          }
        } else {
          throw new Error(resData.message);
        }
      } catch (e) {
        setSearchState('NETWORK_ERROR');
        return;
      }
    }
  };

  return (
    <>
      <Wrapper>
        <Box mb={2} pl={2} mt={3}>
          <Typography variant="h6" fontWeight={'bold'}>
            ชื่อเว็บไซต์ของคุณ
          </Typography>
        </Box>
        <InputWrapper>
          <SubdomainInput
            placeholder="Your subdomain"
            {...register('pageToSearch', { required: true })}
          />
          <SubdomainText>.domain.com</SubdomainText>
        </InputWrapper>
        <Grid item mt={2}>
          <BlackButton
            disabled={isLoading}
            isLoading={isLoading}
            onClick={handleSubmit(checkIfPageExists)}
          >
            บันทึก
          </BlackButton>
        </Grid>
      </Wrapper>

      {/* <form onSubmit={handleSubmit(checkIfPageExists)}>
        <TextField 
          {...register("pageToSearch", { required: true })}
          placeholder="my-fun-page"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          {searchState === "SEARCHING" ? "Searching..." : "Search"}
        </Button>
      </form> */}
      {searchState === 'ERROR' && <p>Page exists</p>}
      {searchState === 'NETWORK_ERROR' && <p>Network error</p>}
    </>
  );
};

export default Welcome;
