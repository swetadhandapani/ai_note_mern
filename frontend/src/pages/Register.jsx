import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { register as doRegister } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await doRegister(data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      nav('/login');
    } catch (err) {
      alert(err.message || 'Register failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Create Your Account 
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('name')}
            placeholder="Full Name"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />

          <input
            {...register('email')}
            placeholder="Email"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />

          <div className="relative">
            <input
              {...register('password')}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          <button className="w-full bg-green-600 text-white py-2.5 rounded hover:bg-green-700 transition">
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
