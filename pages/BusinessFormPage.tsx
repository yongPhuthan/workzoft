// pages/BusinessFormPage.tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
};

const BusinessFormPage: React.FC = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<FormData>({ name: '', company: '', email: '', phone: '' });
  const { register, handleSubmit } = useForm<FormData>({ defaultValues });

  useEffect(() => {
    if (router.query.info) {
      setDefaultValues(JSON.parse(router.query.info as string));
    }
  }, [router.query.info]);

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Submit form data...
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      <input {...register('company')} placeholder="Company" />
      <input {...register('email')} placeholder="Email" />
      <input {...register('phone')} placeholder="Phone"
      />
<button type="submit">Submit</button>
</form>
);
};

export default BusinessFormPage;
