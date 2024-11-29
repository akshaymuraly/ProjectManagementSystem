import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './SignUpPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors,isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try{
      const res = await axios.post("/api/user/signup",data);
      if(res.data.status){
        console.log(res.data)
        navigate("/")
      }
    }catch(err){
      const{response} = err
      setError("root",{message:response.data.message||"Unexpected error"})
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.title}>Sign Up</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
            {...register('Email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email format',
              },
            })}
          />
          {errors.Email && <p className={styles.errorMessage}>{errors.Email.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
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
          {errors.Password && <p className={styles.errorMessage}>{errors.Password.message}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="role" className={styles.label}>Role</label>
          <select
            id="role"
            className={`${styles.input} ${errors.role ? styles.errorInput : ''}`}
            {...register('Role', {
              required: 'Please select a role',
            })}
          >
            <option value="">Select a role</option>
            <option value="ProjectManager">Project Manager</option>
            <option value="TeamLeader">Project Team Leader</option>
            <option value="TeamMember">Team Member</option>
          </select>
          {errors.role && <p className={styles.errorMessage}>{errors.role.message}</p>}
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting?"Loading...":"Sign Up"}
        </button>
        <p className={styles.linkText}>
          Already have an account?{' '}
          <Link
            className={styles.link}
            to={"/"}
          >
            Login
          </Link>
        </p>
        {errors.root && <p className={styles.errorMessage}>{errors.root.message}</p>}
      </form>
    </div>
  );
};

export default SignUpPage;