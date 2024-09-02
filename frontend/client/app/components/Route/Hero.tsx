import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";

type Props = {};
const Hero: FC<Props> = (props) => {
  return (
    <div className="w-full h-screen flex justify-center items-center relative bg-white dark:bg-black">
      <div className="flex w-full h-full">
        <div className="w-1.3/3  flex justify-center items-center">
          <div className="flex justify-center items-center  hero_animation bg-gray-100 dark:bg-gray-800 rounded-full  p-5 ">
            <Image
              src={require("../../../../IMGS/—Pngtree—web developer isometric illustration_6067558.png")}
              className="object-contain w-[50%] h-auto z-10"
              alt="Learning Management System"
            />
          </div>
        </div>
        <div className="w-1.7/3 flex flex-col items-center justify-center text-center 1000px:text-left mt-[150px] 1000px:mt-0">
          <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px]">
            Improve Your Online Experience Instantly
          </h2>
          <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:w-[55%] 1100px:w-[78%] mt-4">
            We have 40+ Online courses & 500k+ Online registered students. Find
            your desired Courses from them.
          </p>
          <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative mt-6 shadow-md">
            <input
              type="search"
              placeholder="Search Courses..."
              className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#000000ac] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
            />
            <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] hover:bg-[#1fa9d9] transition-colors rounded-r-[5px]">
              <BiSearch className="text-white" size={30} />
            </div>
          </div>
          <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center mt-6">
            <Image
              src={require("../../../../IMGS/user1.png")}
              alt="Student 1"
              className="rounded-full shadow-md"
              width={50}
              height={50}
            />
            <Image
              src={require("../../../../IMGS/user2.png")}
              alt="Student 2"
              className="rounded-full ml-[-20px] shadow-md"
              width={50}
              height={50}
            />
            <Image
              src={require("../../../../IMGS/user3.png")}
              alt="Student 3"
              className="rounded-full ml-[-20px] shadow-md"
              width={50}
              height={50}
            />
            <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600] ml-4">
              500k+ people already trust us.{" "}
              <Link
                href="/courses"
                className="dark:text-[#46e256] text-[crimson] hover:underline"
              >
                View Courses
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
