"use client";

import { useEffect, useState } from "react";

export default function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.name) {
          setUser(data);
        }
      })
      .catch(() => { });
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="">
      <div>
        {user ? (
          <>
            <div className="flex justify-center items-center gap-x-12">
              <p className=" text-gray-900 font-semibold">{user.name}</p>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-all"
              >
                Sair
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className=" bg-gray-900 p-2 text-white font-semibold rounded-lg w-[150px] flex justify-center items-center hover:bg-gray-800 transition-all cursor-pointer"
          >
            <svg height="20" width="20" fill="none" viewBox="0 0 45 53" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 22.5C28.7132 22.5 33.75 17.4632 33.75 11.25C33.75 5.03681 28.7132 0 22.5 0C16.2868 0 11.25 5.03681 11.25 11.25C11.25 17.4632 16.2868 22.5 22.5 22.5Z" fill="white" />
              <path d="M45 41.25C45 35.0366 39.9634 30 33.75 30H11.25C5.03681 30 0 35.0366 0 41.25V52.5H45V41.25Z" fill="white" />
            </svg>
            <p className="ml-2">Login</p>
          </button>
        )}
      </div>
    </div>
  );
}
