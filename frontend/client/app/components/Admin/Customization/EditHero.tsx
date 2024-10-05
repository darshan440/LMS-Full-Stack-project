import { style } from "../../../../app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState("");

  const { data ,refetch} = useGetHeroDataQuery("Banner",{refetchOnMountOrArgChange:true});
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
    
      if (data.layout) {
        // Only set state if layout is not null
        setTitle(data.layout.banner.title || ""); // Default to empty string if title is undefined
        setImage(data.layout.banner.image?.url || ""); // Default to empty string if image is undefined
        setSubTitle(data.layout.banner.subTitle || ""); // Default to empty string if subtitle is undefined
      } else {
        // Handle case when layout is null
        console.warn("Layout data is null");
        setTitle(""); // Reset the title
        setImage(""); // Reset the image
        setSubTitle(""); // Reset the subtitle
      }
    }
      if (isSuccess) {
          refetch();
      toast.success("Layout updated Successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = (error as any) || "An unexpected Error occurred";
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, error, isSuccess, refetch]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      // onload callback to handle file read completion
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string); // Correct way to access the result
        }
      };

      reader.readAsDataURL(file); // Read file as Data URL for preview
    }
  };

  const handleEdit = async () => {
  try {
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  } catch (error) {
    console.error("Error updating layout:", error);
  }
};

  return (
    <>
      <div className="w-full 1000px:flex items-center justify-between pt-[100px]">
        {/* Left side - Image */}
        <div className="relative h-[70vh] w-[70vh] hero_animation rounded-full flex items-center justify-center">
          <Image
            src={image}
            layout="fill"
            objectFit="contain"
            alt="Layout image"
            className="object-contain max-w-full h-auto z-10 rounded-full"
          />
          <input
            type="file"
            name=""
            id="banner"
            accept="image/*"
            onChange={handleUpdate}
            className="hidden"
          />
          <label
            htmlFor="banner"
            className="absolute bottom-4 right-4 z-20 p-2 bg-white dark:bg-black dark:border-white rounded-full shadow-lg dark:shadow-lg cursor-pointer"
          >
            <AiOutlineCamera className="dark:text-white text-black text-[18px]" />
          </label>
        </div>

        <div className="flex flex-col items-start text-left pl-10">
          <textarea
            className="dark:text-white dark:placeholder:text-[#ffffff50] text-black placeholder:text-[#00000050] text-[30px] 1000px:text-[60px] 1500px:text-[70px] px-3 w-full font-semibold bg-transparent resize-none"
            value={title}
            placeholder="Improve your online learning experience better instantly"
            onChange={(e) => setTitle(e.target.value)}
            rows={4}
          />

          <textarea
            className="dark:text-[#edfff4] dark:placeholder:text-[#ffffff50] text-[#000000ac] placeholder:text-[#00000050] font-Josefin font-[600] text-[18px] 1500px:w-[55%] 1100px:w-[74%] bg-transparent resize-none mt-4"
            value={subTitle}
            placeholder="We have 40k+ online courses & 500k+ registered students. Find your desired courses from them."
            onChange={(e) => setSubTitle(e.target.value)}
            rows={3}
          />

          <button
            className={`${
              style.button
            } !w-[100px] !min-h-[40px] !h-[40px] mt-6 dark:text-white text-black bg-[#cccccc34] ${
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image // Compare with the correct property
                ? "cursor-pointer !bg-[#42d383]"
                : "!cursor-not-allowed"
            } !rounded`}
            onClick={
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image // Ensure you compare URL correctly
                ? handleEdit
                : () => null
            }
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default EditHero;
