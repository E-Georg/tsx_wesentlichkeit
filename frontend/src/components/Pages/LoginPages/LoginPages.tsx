import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';
import { Form, json, Link, redirect } from 'react-router-dom';
import { useState } from 'react';

type Props = {};

type LoginFormsInputs = {
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  userName: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = (_: Props) => {
  const [loginUser, SetLoginUser] = useState<LoginFormsInputs | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormsInputs) => {
    SetLoginUser({ userName: form.userName, password: form.password });
  };

  return (
    <section>
      <div>
        <div>
          <div>
            <h1>Sign in to your account</h1>
            <Form onSubmit={handleSubmit(handleLogin)}>
              <div>
                <label htmlFor="email">Username</label>
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
              <button onClick={() => authAction(loginUser!!)} type="submit">
                Sign in
              </button>
              <p>
                Don’t have an account yet? <Link to="/register">Sign up</Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

const authAction = async (request: LoginFormsInputs) => {
  const authData = {
    email: request.userName,
    password: request.password,
  };

  // API ANPASSEN
  const response = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: 'Could not authenticate user.' }, { status: 500 });
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem('token', token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString());

  return redirect('/');
};
