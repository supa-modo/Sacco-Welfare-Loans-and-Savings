import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { GiPadlock } from "react-icons/gi";
import bgImage from "../../assets/sacco-bg.jpg";
import logo from "/logo.png";
import { MdLock, MdOutlinePhone } from "react-icons/md";
import { HiMiniDevicePhoneMobile } from "react-icons/hi2";
import { TbMailFilled } from "react-icons/tb";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const onSubmit = (data) => {
    console.log(data);
    // TODO: Implement registration logic
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
      <div className="relative z-10 max-w-xl w-full space-y-8 py-8 px-12 bg-white/80 dark:bg-gray-800/90 rounded-2xl shadow-xl">
        <div className="text-center">
          <img src={logo} alt="sacco-logo" className="w-24 h-24 mx-auto" />
          <h2 className="text-3xl font-extrabold text-primary dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our Welfare Community today
          </p>
        </div>

        <form className="mt-4 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300"
            >
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5" />
              <input
                id="fullName"
                type="text"
                {...register("fullName", {
                  required: "Full Name is required",
                })}
                className="input-field mt-1 pl-12 font-semibold text-gray-600 dark:text-gray-400 text-base py-[0.6rem]"
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Email Input */}
            <div className="md:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300"
              >
                Email
              </label>
              <div className="relative">
                <TbMailFilled className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="input-field items-center mt-1 pl-11 font-semibold text-gray-600 dark:text-gray-400 text-base py-[0.6rem]"
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div className="md:col-span-2">
              <label
                htmlFor="phone"
                className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300"
              >
                Phone Number
              </label>
              <div className="relative">
                <HiMiniDevicePhoneMobile className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5" />
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value:
                        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className="input-field items-center mt-1 pl-12 font-semibold text-gray-600 dark:text-gray-400 text-base py-[0.6rem]"
                  placeholder="+1234567890"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5" />
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="input-field mt-1 pl-12 font-semibold  text-gray-600 dark:text-gray-400 py-[0.6rem]"
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                className="absolute right-5 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex pl-3 items-center">
            <input
              id="terms"
              type="checkbox"
              {...register("terms", {
                required: "You must agree to the terms and conditions",
              })}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor="terms"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-primary font-bold">
                Terms and Conditions
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}

          <button type="submit" className="btn-primary w-full font-semibold">
            Sign up
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
