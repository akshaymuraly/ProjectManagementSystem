import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './LoginPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import { useDispatch } from 'react-redux';
import { userActions } from '../store';

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors,isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try{
      const res = await axios.post("/api/user/signin",data);
      if(res.data.status){
        console.log(res.data)
        dispatch(userActions.userLogin({ role: res.data.role }))
        navigate("/dashboard")
      }
    }catch(err){
      const{response} = err
      setError("root",{message:response.data.message||"Unexpected error"})
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.title}>Login</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
            {...register('Email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email format',
              },
            })}
          />
          {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="Password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
            {...register('Password', {
              required: 'Password is required',
              minLength: {
                value: 3,
                message: 'Must be at least 6 characters',
              },
            })}
          />
          {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting?"Loading...":"Login"}
        </button>
        <p className={styles.linkText}>
          Don't have an account?{' '}
          <Link
            className={styles.link}
            to={"/signup"}
          >
            Create Account
          </Link>
        </p>
        {errors.root && <p className={styles.errorMessage}>{errors.root.message}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
