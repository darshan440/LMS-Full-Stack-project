import React, { FC, useEffect, useState } from "react";
import { style } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import { circularProgressClasses } from "@mui/material";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: FC<Props> = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();
  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New Password do not match");
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
    };
    useEffect(() => {
        if (isSuccess) {
            toast.success("Password changed successfully");
        }
        if (error) {
          if ("data" in error) {
            const errorData = error as any;
            toast.error(errorData.data.message);
          }
        }
    },[isSuccess,error])

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-white pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          area-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-1 pt-3 text-black dark:text-white ">
              Enter your old Password
            </label>
            <input
              type="password"
              className={`${style.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-white `}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-1 pt-4 text-black dark:text-white ">
              Enter your New Password
            </label>
            <input
              type="password"
              className={`${style.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-white `}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-1 pt-3 text-black dark:text-white ">
              Confirm your Password
            </label>
            <input
              type="password"
              className={`${style.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-white `}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border-[#37a39a] text-center text-[#fff] border   rounded-[3px] mt-8 cursor-pointer`}
              type="submit"
              required
              value="Update"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
