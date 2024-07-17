import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type Props = {};

type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required('Email is required'),
  userName: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const RegisterPage = (_: Props) => {
  const [_registerUser, setRegisterUser] = useState<RegisterFormsInputs | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: RegisterFormsInputs) => {
    setRegisterUser({ email: form.email, userName: form.userName, password: form.password });
  };
  return (
    <section>
      <div>
        <div>
          <div>
            <h1>Sign in to your account</h1>
            <form onSubmit={handleSubmit(handleLogin)}>
              <div>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" placeholder="Email" {...register('email')} />
                {errors.email ? <p>{errors.email.message}</p> : ''}
              </div>
              <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Username" {...register('userName')} />
                {errors.userName ? <p>{errors.userName.message}</p> : ''}
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="••••••••" {...register('password')} />
                {errors.password ? <p>{errors.password.message}</p> : ''}
              </div>
              <div>
                <a href="#">Forgot password?</a>
              </div>
              <button type="submit">Sign in</button>
              <p>
                Don’t have an account yet? <a href="#">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
