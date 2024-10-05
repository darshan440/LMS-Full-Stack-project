import Image from "next/image";
import { FC } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import avatarDefault from "../../../../IMGS/userNoIIMG.png";
import Link from "next/link";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { redirect } from "next/dist/server/api-utils";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (index: number) => void;
  logOutHandler: () => void;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logOutHandler,
}) => {
  const getIconColor = (index: number) => {
    return active === index
      ? "text-[#37a39a]" // Active color
      : "text-black dark:text-white"; // Inactive color
  };

  return (
    <div className="w-full">
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 1 ? "dark:bg-slate-800 bg-gray-100" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={user && user.avatar ? user.avatar.url || avatar : avatarDefault}
          alt="User avatar"
          width={20}
          height={20}
          className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
        />
        <h5 className="ml-2 800px:block hidden font-Poppins dark:text-white text-black">
          My Account
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 2 ? "dark:bg-slate-800 bg-gray-100" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} className={getIconColor(2)} />
        <h5 className="ml-2 800px:block hidden font-Poppins dark:text-white text-black">
          Change Password
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 3 ? "dark:bg-slate-800 bg-gray-100" : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className={getIconColor(3)} />
        <h5 className="ml-2 800px:block hidden font-Poppins dark:text-white text-black">
          Enrolled Course
        </h5>
      </div>
      {user.role === "admin" && (
        <Link
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 6 ? "dark:bg-slate-800 bg-gray-100" : "bg-transparent"
            }`}
          href={'/admin'}
        >
          <MdOutlineAdminPanelSettings size={20} className={getIconColor(3)} />
          <h5 className="ml-2 800px:block hidden font-Poppins dark:text-white text-black">
            Admin Dashboard
          </h5>
        </Link>
      )}

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 4 ? "dark:bg-slate-800 bg-gray-100" : "bg-transparent"
        }`}
        onClick={logOutHandler}
      >
        <AiOutlineLogout size={20} className={getIconColor(4)} />
        <h5 className="ml-2 800px:block hidden font-Poppins dark:text-white text-black">
          Logout
        </h5>
      </div>
    </div>
  );
};

export default SideBarProfile;
