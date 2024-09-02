import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Email, Password } from "@mui/icons-material";
import { log } from "console";
import { style } from "../../../app/styles/style";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email!")
    .required("Please Enter Your Email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login: FC<Props> = ({setRoute,setOpen}) => {
  const [show, setShow] = useState(false);
  const [login, { isSuccess, isError, error }] = useLoginMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      login({ email, password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successfully")
      setOpen(false);
    }
     if (error) {
       if ("data" in error) {
         const errorData = error as any;
         toast.error(errorData.data.message);
       }
     }
  }, [isSuccess,error])


  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    // LOGIN Form Structure
    <div className="w-full">
          <h1 className={`${style.titel}`}>Login with ELearning</h1>
          <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className={`${style.label}`}>
          Enter your Email
        </label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="loginmail@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"} ${
            style.input
          }`}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}
        {/* ---------------------------------------------------------------- */}
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${style.label}`}>
            Enter your password
          </label>
          <input
            type={show ? "text" : "password"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password!@%"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${style.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block">{errors.password}</span>
          )}
        </div>
        <button type="submit" className={`${style.button}`} value="Login">
          Login
              </button>
              <br />
              <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white"> Or Join With </h5>
              <div className="flex items-center justify-center my-3">
                  <FcGoogle size={30} className="cursor-pointer mr-2" onClick={() => signIn("google")} />
                  <AiFillGithub size={30} className="cursor-pointer ml-2"  onClick={() => signIn("github")}/> 
              </div>
              <h5 className="text-center pt-4 font-Poppins ">
                  Not have any Account? {""}
              <span className="text-[#2199ff] pl-1 cursor-pointer"
              onClick={() => setRoute('Sign-Up')}>Sing up</span>
              </h5>
              <br />
      </form>
    </div>
  );
};

export default Login;
