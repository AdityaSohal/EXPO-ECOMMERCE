import { UserButton } from "@clerk/clerk-react";
import {
    ClipboardList,
    Home,
    PanelLeft,
    ShoppingBag,
    User,
} from "lucide-react";
import { useLocation } from "react-router-dom";

export const NAVIGATION = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Products", path: "/products", icon: ShoppingBag },
    { name: "Orders", path: "/orders", icon: ClipboardList },
    { name: "Customers", path: "/customers", icon: User },
];

function Navbar() {
    const location = useLocation();
    const currentPage =
        NAVIGATION.find(
            (item) =>
                location.pathname === item.path ||
                location.pathname.startsWith(item.path)
        )?.name || "Dashboard";
    return (
        <div className="navbar w-full bg-base-300 px-4">
            <label
                htmlFor="my-drawer"
                className="btn btn-square btn-ghost"
                aria-label="open sidebar"
            >
                <PanelLeft className="size-5" />
            </label>
            <div className="flex-1 px-4">
                <h1 className="text-xl font-bold">{currentPage}</h1>
            </div>
            <div className="mr-5">
                <UserButton afterSignOutUrl="/login" />
            </div>
        </div>
    );
}

export default Navbar;