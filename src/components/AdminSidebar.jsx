import { useNavigate } from "react-router-dom";
import { FileText, Folder, User, Bell, RotateCcw, ExternalLink, LogOut } from "lucide-react";

function AdminSidebar({ activeTab, onTabChange }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.setItem('online', 'false');
    sessionStorage.removeItem('userRole');
    navigate('/login');
    window.location.reload();
  };

  const menuItems = [
    { id: "article", label: "Article management", icon: FileText },
    { id: "category", label: "Category management", icon: Folder },
    { id: "profile", label: "Profile", icon: User },
    { id: "notification", label: "Notification", icon: Bell },
    { id: "reset", label: "Reset password", icon: RotateCcw },
  ];

  return (
    <aside className="w-[280px] bg-[#EFEFEF] h-screen flex flex-col border-r border-gray-200">
      {/* Header - ปรับ Font และสีให้ตรงรูป */}
      <div className="px-8 py-12">
        <div className="flex items-center gap-1">
          <h1 className="text-[48px] leading-none text-[#4A4A4A] font-bold">hh<span className="text-[#12B279]">.</span></h1>
        </div>
        <h2 className="text-headline-4 text-[#F2B68C] font-medium mt-2">Admin panel</h2>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1">
        <div className="flex flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                // ปรับ px-8 ให้ตรงกับ Header และลบ rounded-lg ออกเพื่อให้สีทับเต็มความกว้างแบบในรูป
                className={`w-full flex items-center gap-4 px-8 py-4 transition-all ${
                  isActive
                    ? "bg-[#D9D7D2] text-[#4A4A4A]" 
                    : "text-[#6B6B6B] hover:bg-[#D9D7D2]/50"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-body-2 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto">
        <button
          className="w-full flex items-center gap-4 px-8 py-4 text-[#6B6B6B] hover:bg-[#D9D7D2]/50 transition-all"
        >
          <ExternalLink className="w-6 h-6" />
          <span className="text-[18px] font-medium">hh. website</span>
        </button>
        
        <div className="border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-8 py-4 text-[#6B6B6B] hover:bg-[#D9D7D2]/50 transition-all"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[18px] font-medium">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;