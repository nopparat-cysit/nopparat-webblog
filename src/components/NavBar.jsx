import { FiMenu } from "react-icons/fi";
import Button from "../common/Button";
import { useNavigate , useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut , RotateCcw , User} from "lucide-react";

function NavBar() {
  const [listToggle , setListToggle] = useState(false)
  const [role, setRole] = useState(sessionStorage.getItem('userRole') || '')
  const navigate = useNavigate()
  const location = useLocation();
  const [userDropdownOpen,setUserDropdownOpen] = useState(false)
  console.log(listToggle);
  console.log("ตอนนี้คุณอยู่ที่หน้า:", location.pathname);

  // อ่าน role จาก sessionStorage เมื่อ component mount หรือ location เปลี่ยน
  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole') || '';
    setRole(storedRole);
  }, [location.pathname]);

  const handleNavigate = (path) => {
    sessionStorage.setItem('prevPath', location.pathname);
    navigate(path);
    setListToggle(false);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full h-12 border-b border-b-brown-300 flex items-center justify-between px-4 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 md:h-20 md:px-32 hover:bg-white/100 hover:shadow-md">
      <button
        type="button"
        className="group"
        onClick={() => navigate("/")}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        aria-label="Go to homepage"
      >
        <svg
          className="h-8 w-8 md:h-11 md:w-11 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path 
            className="transition-colors duration-300 group-hover:fill-brown-500"
            d="M5.43891 8.54016C6.11091 8.54016 6.70824 8.68416 7.23091 8.97216C7.76424 9.26016 8.18024 9.68682 8.47891 10.2522C8.78824 10.8175 8.94291 11.5002 8.94291 12.3002V17.5002H7.13491V12.5722C7.13491 11.7828 6.93757 11.1802 6.54291 10.7642C6.14824 10.3375 5.60957 10.1242 4.92691 10.1242C4.24424 10.1242 3.70024 10.3375 3.29491 10.7642C2.90024 11.1802 2.70291 11.7828 2.70291 12.5722V17.5002H0.878906V5.66016H2.70291V9.70816C3.01224 9.33482 3.40157 9.04682 3.87091 8.84416C4.35091 8.64149 4.87357 8.54016 5.43891 8.54016Z" 
            fill="#43403B" 
          />
          <path 
            className="transition-colors duration-300 group-hover:fill-brown-500"
            d="M15.8295 8.54016C16.5015 8.54016 17.0989 8.68416 17.6215 8.97216C18.1549 9.26016 18.5709 9.68682 18.8695 10.2522C19.1789 10.8175 19.3335 11.5002 19.3335 12.3002V17.5002H17.5255V12.5722C17.5255 11.7828 17.3282 11.1802 16.9335 10.7642C16.5389 10.3375 16.0002 10.1242 15.3175 10.1242C14.6349 10.1242 14.0909 10.3375 13.6855 10.7642C13.2909 11.1802 13.0935 11.7828 13.0935 12.5722V17.5002H11.2695V5.66016H13.0935V9.70816C13.4029 9.33482 13.7922 9.04682 14.2615 8.84416C14.7415 8.64149 15.2642 8.54016 15.8295 8.54016Z" 
            fill="#43403B" 
          />
          <path 
            className="transition-all duration-300 group-hover:fill-brand-green group-hover:scale-110"
            d="M22.3962 17.6122C22.0655 17.6122 21.7882 17.5002 21.5642 17.2762C21.3402 17.0522 21.2282 16.7748 21.2282 16.4442C21.2282 16.1135 21.3402 15.8362 21.5642 15.6122C21.7882 15.3882 22.0655 15.2762 22.3962 15.2762C22.7162 15.2762 22.9882 15.3882 23.2122 15.6122C23.4362 15.8362 23.5482 16.1135 23.5482 16.4442C23.5482 16.7748 23.4362 17.0522 23.2122 17.2762C22.9882 17.5002 22.7162 17.6122 22.3962 17.6122Z" 
            fill="#12B379" 
          />
        </svg>
      </button>
      {!role || role === '' ? (
        <>
        {/* Desktop buttons */}
      <div className="hidden md:flex items-center gap-3 " >
        <Button variant="secondary" onClick={() => handleNavigate("/login")} >Log in</Button>
        <Button onClick={() => handleNavigate("/signup")}>Sign up</Button>
      </div>

      {/* Mobile menu icon: only on mobile */}
      <div className="flex md:hidden items-center">
        <button
          type="button"
          onClick={() => setListToggle(!listToggle)}
  
          
        >
          <FiMenu className="w-6 h-6 transition-transform duration-300 hover:rotate-90" />
        </button>
      </div>
      {/* Example mobile menu (optional): */}
      {listToggle && (
        <div className="absolute right-[0.5px] top-12 p-6 bg-white/95 w-full shadow-lg flex flex-col gap-4 md:hidden">
          <Button variant="secondary" onClick={() => handleNavigate("/login")}>Log in</Button>
          <Button onClick={() => handleNavigate("/signup")}>Sign up</Button>
        </div>
      )}
      </>
      ) 
      : 
      (
        <>
        <div>
        {/* 
          Mockup: User dropdown menu, only visible for authenticated users.
          You will likely need to handle avatar, display name, dropdown UI/UX, and logout logic outside of this snippet.
        */}
        <div className="relative">
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setUserDropdownOpen(prev => !prev)}
          >
            {/* Avatar */}
            <img
              src={'https://image2url.com/r2/default/images/1769339595062-978cbe43-e571-4d63-aa61-ec47575082d0.png'}
              alt={"Avatar"}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow"
            />
            {/* User display name */}
            <span className="text-brown-600 font-medium line-clamp-1 max-w-[100px] hidden md:inline-block">
              {"Pond"}
            </span>
            {/* Dropdown icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {userDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg py-3 z-50 border border-brown-100 animate-fade-in">
              <div className="gap-2">
                <button
                className="flex items-center w-full gap-3 px-5 py-2 hover:bg-brown-50 text-brown-700 transition-all group"
                onClick={() => { setUserDropdownOpen(false); handleNavigate('/profile'); }}
              >
                <User />
                <span className="font-medium">Profile</span>
              </button>
              <button
                className="flex items-center w-full gap-3 px-5 py-2 hover:bg-brown-50 text-brown-700 transition-all group"
                onClick={() => { setUserDropdownOpen(false); handleNavigate('/reset-password'); }}
              >
                <RotateCcw />
                <span className="font-medium">Reset password</span>
              </button>
              </div>
              
              <div className="my-1 border-t border-brown-300" />
              <button
                className="flex items-center w-full gap-3 px-5 py-2 hover:bg-brown-50 text-brown-700 transition-all group"
                onClick={() => { setUserDropdownOpen(false); handleLogout(); }}
              >
                <LogOut />
                <span className="font-medium">Log out</span>
              </button>
            </div>
          )}
        </div>
        </div>
      </>
      )
      }
      
    </header>
  );
}

export default NavBar;
