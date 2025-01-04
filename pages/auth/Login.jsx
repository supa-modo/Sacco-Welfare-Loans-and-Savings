import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import bgImage from "../../assets/sacco-bg.jpg";
import logo from "/logo.png";
import { HiLockClosed, HiUser } from "react-icons/hi";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { PiUser, PiUserBold } from "react-icons/pi";
import { GiPadlock } from "react-icons/gi";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      // Navigate based on user role
      if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } else {
      setLoginError(result.error);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-lg  w-full space-y-8 py-8 px-10 bg-white/80 dark:bg-gray-800/90 rounded-2xl shadow-xl">
        <div className="text-center">
          <img src={logo} alt="sacco-logo" className="w-24 h-24 mx-auto" />
          <h2 className="text-3xl font-extrabold text-primary dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your Welfare Account
          </p>
        </div>

        <form className="mt-4 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {loginError && (
            <div className="bg-red-100/70 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="relative">
                <PiUserBold className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="input-field mt-1 pl-12 font-semibold text-gray-600 dark:text-gray-400 py-[0.6rem]"
                  placeholder="Enter your username or email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <GiPadlock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="input-field mt-1 pl-12 font-semibold text-gray-600 dark:text-gray-400 py-[0.6rem]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm font-bold text-primary hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary w-full font-semibold">
            Sign in
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-primary hover:text-primary/80"
            >
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
