import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { PiIdentificationBadgeDuotone } from "react-icons/pi";
import { useAuth } from "../../context/AuthContext";
import bgImage from "../../assets/sacco-bg.jpg";
import logo from "/logo.png";
import userService from "../../services/api/userService";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const memberId = watch("memberId");
  const email = watch("email");

  // Validate Member ID format and fetch member details
  useEffect(() => {
    const validateMemberId = async () => {
      if (memberId) {
        // Reset any previous errors
        setRegisterError("");
        setMemberEmail("");

        // Validate format (M followed by 6 characters)
        const memberIdRegex = /^M\d{6}$/;
        if (!memberIdRegex.test(memberId)) {
          setRegisterError("Member ID must be in the format M123456");
          return;
        }

        try {
          const response = await userService.checkMemberId(memberId);
          setMemberEmail(response.email);
          setValue("email", response.email);
        } catch (error) {
          setRegisterError(
            error.response?.data?.error ||
              "Invalid Member ID, check your ID and try again"
          );
          setMemberEmail("");
          setValue("email", "");
        }
      }
    };

    validateMemberId();
  }, [memberId, setValue]);

  const onSubmit = async (data) => {
    try {
      if (!data.terms) {
        setRegisterError("You must agree to the terms and conditions");
        return;
      }

      if (!memberEmail) {
        setRegisterError("Please enter a valid Member ID to get your email");
        return;
      }

      const result = await registerUser({
        email: memberEmail,
        password: data.password,
        memberId: data.memberId,
      });

      if (result.success) {
        navigate("/login", {
          state: {
            message:
              "Registration successful! Please login with your credentials.",
          },
        });
      } else {
        setRegisterError(result.error);
      }
    } catch (error) {
      setRegisterError("An error occurred during registration");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-xl w-full space-y-8 py-8 px-12 bg-white/80 dark:bg-gray-800/90 rounded-2xl shadow-xl">
        <div className="text-center">
          <img src={logo} alt="sacco-logo" className="w-24 h-24 mx-auto" />
          <h2 className="text-3xl font-extrabold text-primary dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join to access and manage your welfare savings and loans
          </p>
        </div>

        <form className="mt-4 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Error Display */}
          {registerError && (
            <div className=" text-sm text-red-600">{registerError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {/* Member ID Input */}
            <div>
              <label className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300">
                Member ID
              </label>
              <div className="relative">
                <PiIdentificationBadgeDuotone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-6 w-6" />
                <input
                  type="text"
                  {...register("memberId", {
                    required: "Member ID is required",
                    pattern: {
                      value: /^M\d{6}$/,
                      message: "Member ID must be in format M111111",
                    },
                  })}
                  className="input-field items-center mt-1 pl-12 font-semibold text-gray-600 dark:text-gray-400 text-base py-[0.6rem]"
                  placeholder="Enter your Member ID"
                />
              </div>
              {errors.memberId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.memberId.message}
                </p>
              )}
            </div>

            {/* Email Display */}
            <div>
              <label className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300">
                Email
              </label>
              <div className="">
                <input
                  type="text"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  className="input-field mt-1 pl-4 font-semibold text-gray-600 bg-gray-100 cursor-not-allowed w-full py-[0.6rem] placeholder:text-red-300 placeholder:font-normal"
                  placeholder="Automatic from member ID"
                />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5" />
              <input
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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-bold pl-2 text-gray-500 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="input-field mt-1 pl-12 font-semibold text-gray-600 dark:text-gray-400 py-[0.6rem]"
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

          {/* Terms and Conditions */}
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
