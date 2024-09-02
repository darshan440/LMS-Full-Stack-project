"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center mx-4">
      {theme === "light" ? (
        <div
          className="cursor-pointer text-black"
           onClick={() => setTheme("dark")}
              >
          <BiMoon size={25} />
        </div>
      ) : (
        <div
          className="cursor-pointer text-yellow-500"
          onClick={() => setTheme("light")}
        >
          <BiSun size={25} />
        </div>
      )}
    </div>
  );
};
