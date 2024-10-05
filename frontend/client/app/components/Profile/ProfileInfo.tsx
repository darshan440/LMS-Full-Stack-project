import Image from "next/image";
import { style } from "../../styles/style";
import { AiOutlineCamera } from "react-icons/ai";
import avatarDefault from "../../../../IMGS/userNoIIMG.png";
import React, { FC, useEffect, useState } from "react";
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
  setAvatar: (avatar: string | null) => void; // Added to update avatar
};

const ProfileInfo: FC<Props> = ({ avatar, user, setAvatar }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [loadUser, setLoadUser] = useState(false);
  const { } = useLoadUserQuery(undefined, { skip: loadUser ? false : true });
  const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();

  const imageHandler = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        if (fileReader.readyState === 2) {
          const newAvatar = fileReader.result as string;
          try {
            await updateAvatar(newAvatar); // Trigger the mutation to upload the avatar
            setAvatar(newAvatar); // Update the avatar state
          } catch (error) {
            console.log("Upload error: ", error);
          }
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isSuccess || success) {
      setLoadUser(true);
      toast.success("Profile Updated Successfully");
    }
    if (error || updateError) {
      console.log("Mutation error: ", error);
    }
  }, [isSuccess, error, success, updateError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({
        name: name,
      })
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={
              user && user.avatar  ? user.avatar.url || avatar : avatarDefault
            }
            alt="User Avatar"
            width={120}
            height={130}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
          />
          <input
            type="file"
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png, image/jpg, image/jpeg, image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1 " fill="#fff" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4 dark:text-white text-black ">
            <div className="w-[100%]">
              <label className="block pb-2">Full Name</label>
              <input
                type="text"
                className={`${style.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="w-[100%] pt-2 dark:text-white text-black">
              <label className="block pb-2">Email Address</label>

              <input
                type="text"
                readOnly
                className={`${style.input} !w-[95%] mb-1 800px:mb-0`}
                required
                value={user?.email}
              />
            </div>

            <input
              className={
                "w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer"
              }
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
