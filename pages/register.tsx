import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { TextField, Grid, Button, Box, Typography } from '@mui/material';
import BlackButtonFull from '../components/Buttons/BlackButtonFull';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
interface FormInputs {
  email: string;
  password: string;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
`;

const SubmitButton = styled.input`
  padding: 10px 20px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
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
const Input = styled.input`
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  position: relative;

  /* Add some right padding to accommodate the icon and button */
  padding-right: 40px;
`;

const PasswordToggleIcon = styled.div`
  position: absolute;
  top: 57%;
  right: 30px;
  transform: translateY(-100%);
  cursor: pointer;
`;
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    // handle your login logic here...

    setIsLoading(false);
  };

  const isDisabled = !email || !password;

  return (
    <Form onSubmit={handleSubmit}>
              <Box mb={5} alignSelf={'flex-start'} mt={3}>
          <p className="font_page text-[28px] font-semibold  text-left">
            ลงชื่อเข้าใช้
          </p>
        </Box>
      <Label>
        <p>อีเมล</p>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Label>
      <Label>
        <p>รหัสผ่าน</p>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Label>
      <BlackButtonFull
  disabled={isDisabled || isLoading}
  isLoading={isLoading}
  onClick={handleSubmit}
>
  Login
</BlackButtonFull>

       
    </Form>
  );
};
const RegisterForm = () => {
  const [subscriptionType, setSubscriptionType] = useState('pending');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const showLoginForm = () => setIsLogin(true);
  const showRegisterForm = () => setIsLogin(false);

  const onSubmit = async (data: FormInputs) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      // Here, you would send a request to your server to create a new user with paymentStatus as "pending".
      const response = await fetch('/api/auth/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          subscriptionType,
          paymentStatus: 'pending',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (response.ok) {
        // User registration successful, sign them in
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result.error) {
          console.error(result.error);
          // Handle error
        } else {
          setIsLoading(false);
          router.push(`/companySetting`);
        }
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };


  const isDisabled = !email || !password;

  return (
    <Form onSubmit={handleSubmit}>
    <Box mb={5} alignSelf={'flex-start'} mt={3}>
      <p className="font_page text-[28px] font-semibold  text-left">
        สมัครสมาชิก
      </p>
    </Box>
    <Label>
      <p className="font_page text-[16px] font-semibold">ชื่อของคุณ </p>
      <Input
        type="name"
        placeholder="ชื่อจริง นามสกุล"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Label>
    <Label>
      <p className="font_page text-[16px] font-semibold">อีเมลของคุณ </p>
      <Input
        type="email"
        placeholder="example@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </Label>
    <Label>
      <p className="font_page text-[16px] font-semibold">สร้างรหัสผ่าน </p>
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="อย่างน้อย 8 อักขระ"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        
      />
      <PasswordToggleIcon onClick={handleTogglePasswordVisibility}>
        {showPassword ? (
          <VisibilityOffOutlinedIcon />
        ) : (
          <VisibilityOutlinedIcon />
        )}
      </PasswordToggleIcon>
    </Label>

    <Label>
      <p className="font_page text-[16px] font-semibold">ยืนยันรหัสผ่านอีกครั้ง </p>
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder=""
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        
      />
      <PasswordToggleIcon onClick={handleTogglePasswordVisibility}>
        {showPassword ? (
          <VisibilityOffOutlinedIcon />
        ) : (
          <VisibilityOutlinedIcon />
        )}
      </PasswordToggleIcon>
    </Label>

    <BlackButtonFull
  disabled={isDisabled || isLoading}
  isLoading={isLoading}
      onClick={handleSubmit}
    >
      ขั้นตอนถัดไป
    </BlackButtonFull>
  </Form>
  );
};
const Register = () => {
  const [isLogin, setIsLogin] = useState(false);
  const showLoginForm = () => setIsLogin(true);
const showRegisterForm = () => setIsLogin(false);


  // const [subscriptionType, setSubscriptionType] = useState('pending');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [name, setName] = useState('');
  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  // const [passwordConfirm, setPasswordConfirm] = useState('');
  // const [showPassword, setShowPassword] = useState(false);
  // const [isLogin, setIsLogin] = useState(false);
  // const showLoginForm = () => setIsLogin(true);
  // const showRegisterForm = () => setIsLogin(false);
  

  // const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  // const onSubmit = async (data: FormInputs) => {
  //   try {
  //     const res = await fetch('/api/auth/register', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!res.ok) {
  //       throw new Error('Registration failed');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const handleTogglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   setIsLoading(true);
  //   e.preventDefault();

  //   try {
  //     // Here, you would send a request to your server to create a new user with paymentStatus as "pending".
  //     const response = await fetch('/api/auth/createUser', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //         name,
  //         subscriptionType,
  //         paymentStatus: 'pending',
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();

  //     if (response.ok) {
  //       // User registration successful, sign them in
  //       const result = await signIn('credentials', {
  //         redirect: false,
  //         email,
  //         password,
  //       });

  //       if (result.error) {
  //         console.error(result.error);
  //         // Handle error
  //       } else {
  //         setIsLoading(false);
  //         router.push(`/companySetting`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // Handle error
  //   }
  // };

  return (
    <Wrapper>
    {isLogin ? <LoginForm /> : <RegisterForm />}
    <button onClick={isLogin ? showRegisterForm : showLoginForm}>
      {isLogin ? 'ยังไม่มีบัญชี ? สร้างบัญชีใหม่' : 'มีบัญชีอยู่แล้ว? ลงชื่อเข้าใช้'}
    </button>
  </Wrapper>
  );
};

export default Register;
