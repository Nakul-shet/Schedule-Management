import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor, FaTooth, FaLocationDot } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoSettings  } from "react-icons/io5";
import { BsCalendarEventFill } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { CONFIG } from "../config";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const [activeIcon, setActiveIcon] = useState("home");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    // Show SweetAlert2 confirmation dialog
    const { value } = await Swal.fire({
      title: 'Do you want to Logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'No, Stay',
      icon: 'question'
    });

    // If the user selects "Yes", proceed with the API call
    if (value) {
      try {
        const res = await axios.get(`${CONFIG.runEndpoint.authUrl}/api/v1/user/admin/logout`, {
          withCredentials: true,
        });
        toast.success(res.data.message); // Show success message
        setIsAuthenticated(false); // Update authentication status
      } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong'); // Show error message
      }
    } else {
      // If the user selects "No", do nothing or handle it differently
      console.log('User chose not to logout.');
    }
  };


  const handleIconClick = (icon, navigatePath) => {
    setActiveIcon(icon);
    navigateTo(navigatePath);
    setShow(!show);
  };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome
            className={activeIcon === "home" ? "active-icon" : ""}
            onClick={() => handleIconClick("home", "/")}
          />
          <FaTooth
            className={activeIcon === "patients" ? "active-icon" : ""}
            onClick={() => handleIconClick("patients", "/patients")}
          />
          <BsCalendarEventFill
            className={activeIcon === "events" ? "active-icon" : ""}
            onClick={() => handleIconClick("events", "/appointment")}
          />
          <FaUserDoctor
            className={activeIcon === "doctors" ? "active-icon" : ""}
            onClick={() => handleIconClick("doctors", "/doctors")}
          />
          {/* <MdAddModerator
            className={activeIcon === "addAdmin" ? "active-icon" : ""}
            onClick={() => handleIconClick("addAdmin", "/admin/addnew")}
          /> */}
          {/* <IoPersonAddSharp
            className={activeIcon === "addDoctor" ? "active-icon" : ""}
            onClick={() => handleIconClick("addDoctor", "/doctor/addnew")}
          /> */}
          {/* <AiFillMessage
            className={activeIcon === "messages" ? "active-icon" : ""}
            onClick={() => handleIconClick("messages", "/messages")}
          /> */}
          <IoLogoWhatsapp
            className={activeIcon === "whatsapp" ? "active-icon" : ""}
            onClick={() => handleIconClick("whatsapp", "/messages")}
          />
          <FaLocationDot
            className={activeIcon === "location" ? "active-icon" : ""}
            onClick={() => handleIconClick("location", "/clinics")}
          />
          <IoSettings
            className={activeIcon === "settings" ? "active-icon" : ""}
            onClick={() => handleIconClick("settings", "/messages")}
          />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
