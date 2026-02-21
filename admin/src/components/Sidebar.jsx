import { useUser } from "@clerk/clerk-react";
import { ShoppingBagIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NAVIGATION } from "./Navbar";

function Sidebar() {
    const location = useLocation();
    const { user } = useUser();
    return (
        <div className="drawer-side is-drawer-close:overflow-visible">
            <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
            ></label>
            <div className="flex min-h-full flex-col items-start bg-base-200">
                <div className="p-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                            <ShoppingBagIcon className="w-6 h-6 text-primary-content" />
                        </div>
                        <span className="text-xl font-bold is-drawer-close:hidden">
                            Admin
                        </span>
                    </div>
                </div>
                <ul className="menu w-full grow flex flex-col gap-2 px-4">
                    {NAVIGATION.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center gap-2 ${
                                        isActive
                                            ? "bg-primary text-primary-content"
                                            : ""
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="is-drawer-close:hidden">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="p-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="avatar shrink-0">
                            <img
                                src={user?.imageUrl}
                                alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                                className="w-10 h-10 rounded-full"
                            />
                        </div>
                        <div className="flex-1 min-w-0 is-drawer-close:hidden">
                            <p className="text-sm font-semibold truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs opacity-60 truncate">
                                {user?.primaryEmailAddress?.emailAddress}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;