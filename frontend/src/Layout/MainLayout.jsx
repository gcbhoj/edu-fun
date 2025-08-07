import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";
import { IoIosSunny, IoIosMoon } from "react-icons/io";

const MainLayout = () => {
  const [theme, setTheme] = useState("light");

  // On mount, check for localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme changes to <html> tag and save to localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <div className="bg-white dark:bg-zinc-800 dark:text-white min-h-screen font-serif">
      <div className="flex justify-end mr-1">
        <div className="bg-zinc-300 dark:bg-zinc-700 p-2 rounded-xl flex w-[100px] h-10 items-center m-1">
          <button
            onClick={() => setTheme("light")}
            className="bg-transparent p-3 hover:bg-zinc-200 dark:hover:bg-zinc-100/10 rounded-xl text-black dark:text-white"
          >
            <IoIosSunny />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className="bg-transparent p-3 hover:bg-zinc-200 dark:hover:bg-zinc-100/10 rounded-xl text-black dark:text-white"
          >
            <IoIosMoon />
          </button>
        </div>
      </div>

      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
