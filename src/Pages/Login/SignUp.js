import React, { useEffect, useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
  useSignInWithGoogle,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { useForm } from "react-hook-form";
import Loading from "../Shared/Loading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const SignUp = () => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("/[a-z0-9]+@[a-z]+.[a-z]{2,3}/", "Provide a valid email")
      // .isValid(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Password doesn't matched"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [updateProfile, updating, updateError] = useUpdateProfile(auth);

  const [sendEmailVerification, sending, verifyError] =
    useSendEmailVerification(auth);

  const navigate = useNavigate();

  let signInerror;
  let confirmPasserror;

  const location = useLocation();
  let from = location.state?.from?.pathname || "/";

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm(formOptions);

  useEffect(() => {
    if (gUser || user) {
      // console.log(gUser || user);
      navigate(from, { replace: true });
    }
  }, [gUser, user, from, navigate]);

  if (loading || gLoading || updating || sending) {
    return <Loading />;
  }

  if (gError || error || updateError || verifyError) {
    signInerror = (
      <p className="text-red-500 text-center">
        <small>
          {error?.message ||
            gError?.message ||
            updateError?.message ||
            verifyError?.message}
        </small>
      </p>
    );
  }

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      confirmPasserror = (
        <p className="text-red-500 text-center">
          <small>Password doesn't matched</small>
        </p>
      );
      // return;
    } else {
      await createUserWithEmailAndPassword(data.email, data.password);
      await updateProfile({ displayName: data.name });
      await sendEmailVerification();
      console.log("update done");
      console.log("sent email");
      // navigate("/appointment");
      navigate(from, { replace: true });
    }
  };
  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="input input-bordered w-full max-w-xs"
                {...register("name", {
                  // required: {
                  //   value: true,
                  //   message: "Name is Required",
                  // },
                })}
              />
              <label className="label">
                {errors.name?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </label>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="input input-bordered w-full max-w-xs"
                {...register("email", {
                  // required: {
                  //   value: true,
                  //   message: "Email is Required",
                  // },
                  // pattern: {
                  //   value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  //   message: "Provide a valid email",
                  // },
                })}
              />
              <label className="label">
                {errors.email?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                )}
                {errors.email?.type === "pattern" && (
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </label>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full max-w-xs"
                {...register("password", {
                  // required: {
                  //   value: true,
                  //   message: "Password is Required",
                  // },
                  // minLength: {
                  //   value: 6,
                  //   message: "Must be 6 caracters or longer",
                  // },
                })}
              />
              <label className="label">
                {/* {errors.password?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                )}
                {errors.password?.type === "minLength" && (
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                )} */}
                <span className="label-text-alt text-red-500">
                  {errors.password?.message}
                </span>
              </label>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="input input-bordered w-full max-w-xs"
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Password is Required",
                  },
                  // validate: (value) =>
                  //   value === event.target.password.value || "error message",
                })}
              />

              <label className="label">
                <span className="label-text-alt text-red-500">
                  {errors.confirmPassword?.message}
                </span>
              </label>
            </div>
            {signInerror}
            <p className="mb-2">
              <span class="label-text-alt">
                <Link className="hover:text-primary" to="/forgetpassword">
                  Forget Password?
                </Link>
              </span>
            </p>

            <input
              className="btn w-full max-w-xs"
              type="submit"
              value="Sign Up"
            />
          </form>
          <p className="text-center">
            <small>
              Already have an account?{" "}
              <Link className="text-primary" to="/login">
                Please Login
              </Link>
            </small>
          </p>
          <div className="divider">OR</div>
          <button
            onClick={() => signInWithGoogle()}
            className="btn btn-outline"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
