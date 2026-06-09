import React, { useEffect, useState, useRef } from "react";
import { HiOutlineHome } from "react-icons/hi2";
import { FaChartColumn } from "react-icons/fa6";
import { FaRegChartBar } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router";
import { MdOutlineAccountCircle } from "react-icons/md";

import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { FaRegDotCircle } from "react-icons/fa";
import { MdOutlineHourglassEmpty } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import axios from "axios";
import toast from "react-hot-toast";

function Sidebar() {


  const [sidebar, setSidebar] = useState(true);
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 1024) {
        setSidebar(false);
        } else {
        setSidebar(true);
        }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
    }, []);
  

    
  const logoutHandler = async () => {
    try{
        const res = await axios.post("/api/user/logout")
        if(res?.data?.success){ 
            localStorage.removeItem("token");
            toast.success(res?.data?.msg)
        }
    }catch(err){
        console.log("error while logout frontend: ", err);
        toast.error(err.response?.data?.msg)
    }
  }


   const [user, setUser] = useState(null);

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "/api/user/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(res.data.user);

      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);



  const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
            sidebar &&
            sidebarRef.current &&
            !sidebarRef.current.contains(event.target)
            ) {
            setSidebar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sidebar]);



    const timeoutRef = useRef(null);

    // const handleLeave = () => {
    // timeoutRef.current = setTimeout(() => {
    //     setSidebar(false);
    // }, 300);
    // };

    const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    };



  return (
    <div>

        <div
            className="fixed left-0 top-0 h-screen w-6 z-40"
            onMouseEnter={() => {
                clearTimeout(timeoutRef.current);
                setSidebar(true);
            }}
        />
        
            <div onClick={handleSidebar} className={` cursor-pointer group  absolute text-neutral-400 z-60 mt-5.5  transition-all duration-300    ${sidebar ? "ml-50" : "ml-5 "}`}> 
                {sidebar ? (
                <TbLayoutSidebarLeftCollapseFilled
                    className={`text-2xl hover:text-white transition-all duration-100 group-hover:text-white `}
                />
                ) : (
                <TbLayoutSidebarRightCollapseFilled className="text-2xl hover:text-white transition-all duration-100 group-hover:text-white  " />
                )}
            </div>

            <div 
                ref={sidebarRef}   
                onMouseEnter={handleEnter}
                className={`${sidebar ?  "translate-x-0" : "-translate-x-full"}
                    transition-transform duration-300
                    h-screen w-60 bg-neutral-900/98
                    text-neutral-400 px-3 py-5 flex flex-col
                    border-r border-neutral-700/40
                    fixed left-0 top-0 z-50
                    lg:relative border-r-neutral-700/40 border-y-0 border-l-0 border`}>
                        
                <div className=" flex justify-between items-center w-full border-b-neutral-700/40 border-x-0 border-t-0 border-2 pb-3 px-3 ">

                    <p className="text-xl font-gothic  tracking-wide ">Timmo</p>

                </div>



                <Link to="/">
                    <div className={`rounded-lg h-10  p-2 px-3 mt-5 cursor-pointer active:scale-99 transition-all duration-100 hover:bg-neutral-700/40 font-gothic flex items-center gap-2 group ${isActive("/") ? "bg-neutral-700/40" : ""}`}>

                        <HiOutlineHome className={`text-xl transition-all duration-100 ${isActive("/") ? "text-white" : "text-neutral-500"}`} />
                        <p className={`font-poppins  transition-all duration-100  ${isActive("/") ? "text-white" : "text-neutral-500"}`}>
                            Clock
                        </p>

                    </div>
                </Link>


                <Link to="/stopwatch">
                    <div className={`rounded-lg h-10  p-2 px-3 mt-2 cursor-pointer active:scale-99 transition-all duration-100 hover:bg-neutral-700/40 font-gothic flex items-center gap-2 group ${isActive("/stopwatch") ? "bg-neutral-700/40" : ""}`}>

                        <FaRegDotCircle className={`text-lg transition-all duration-100 ${isActive("/stopwatch") ? "text-white" : "text-neutral-500"}`} />
                        <p className={`font-poppins  transition-all duration-100  ${isActive("/stopwatch") ? "text-white" : "text-neutral-500"}`}>
                            Stopwatch
                        </p>

                    </div>
                </Link>


                <Link to="/countdown">
                    <div className={`rounded-lg h-10  p-2 px-3 mt-2 -mb-3 cursor-pointer active:scale-99 transition-all duration-100 hover:bg-neutral-700/40 font-gothic flex items-center gap-2 group  ${isActive("/countdown") ? "bg-neutral-700/40" : ""}`}>

                        <MdOutlineHourglassEmpty className={`text-xl transition-all duration-100 ${isActive("/countdown") ? "text-white" : "text-neutral-500"}`} />
                        <p className={`font-poppins  transition-all duration-100  ${isActive("/countdown") ? "text-white" : "text-neutral-500"}`}>
                            Countdown
                        </p>

                    </div>
                </Link>



                <div className=" border-t-neutral-700/40 border-x-0 border-b-0 border-2 mt-8">
                    <Link to="/analytics">
                        <div className={`rounded-lg h-10 hover:bg-neutral-700/40 p-2 px-3 mt-5 cursor-pointer active:scale-99 transition-all duration-100 font-gothic flex items-center gap-2 group ${isActive("/analytics") ? "bg-neutral-700/40" : ""}`}>

                            <FaRegChartBar className={`text-lg  transition-all duration-100  ${isActive("/analytics") ? "text-white" : "text-neutral-500"}`} />
                            <p className={`font-poppins  transition-all duration-100   ${isActive("/analytics") ? "text-white" : "text-neutral-500"}`}>
                                Analytics
                            </p>

                        </div>
                    </Link>


                    <Link to="/settings">
                        <div className={`rounded-lg h-10 hover:bg-neutral-700/40 p-2 px-3 mt-2 cursor-pointer active:scale-99 transition-all duration-100 font-gothic flex items-center gap-2 group ${isActive("/settings") ? "bg-neutral-700/40" : ""}`}>

                            <IoSettingsOutline className={`text-xl  transition-all duration-100  ${isActive("/settings") ? "text-white" : "text-neutral-500"}`} />
                                <p className={`font-poppins transition-all duration-100   ${isActive("/settings") ? "text-white" : "text-neutral-500"}`}>
                                    Settings
                                </p>

                        </div>
                    </Link>




                    <div className="rounded-lg h-25 w-54 bg-neutral-800 overflow-x-hidden mt-68 px-2 flex flex-col gap-2 items-start ">

                        <div className="flex gap-2 items-center mt-2 hover:bg-neutral-700 rounded-md px-3 transition-all duration-100 w-50 h-9">
                            <MdOutlineAccountCircle className="text-2xl text-neutral-500"/>

                            <p className="text-neutral-500 font-semibold ">{user?.name}</p>
                        </div>
                        

                        <Link to="/login">
                            <div onClick={logoutHandler} className="flex gap-2 items-center  hover:bg-neutral-700 rounded-md px-3 transition-all duration-100 w-50 h-9 cursor-pointer">
                                <PiSignOutBold className="text-xl text-neutral-500" /> 

                                <p className="text-neutral-500 font-semibold ">Sign Out</p>
                            </div>
                        </Link>
                            

                    </div>

                </div>

                

            </div>

        

    </div>
  );
}

export default Sidebar;
