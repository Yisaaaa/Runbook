"use client";

import clsx from "clsx";
import { GalleryVerticalEnd, LogOut } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatarFallback, getAvatarUrl } from "@/lib/avatar";
import { useAuthStore } from "@/store/authStore";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function NavBar({ classname }: { classname?: string }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    try {
      logout();
      toast.success("User logged out");
    } catch (error) {
      toast.error("Failed to log out");
      console.log("failed to logout: ", error);
    }
  };

  return (
    <header
      className={clsx(
        classname,
        "py-4 border-b border-b-muted flex items-center justify-between"
      )}
    >
      <div className="max-w-5xl flex justify-between mx-auto w-full">
        <Link href={"/"} className="flex gap-4 items-center">
          <GalleryVerticalEnd className="w-5 h-5" />
          <span className="text-2xl font-semibold">Runbook</span>
        </Link>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={getAvatarUrl(user?.email ?? "")} />
                <AvatarFallback>
                  {getAvatarFallback(user?.username ?? "")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
              <DropdownMenuLabel className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage src={getAvatarUrl(user?.email ?? "")} />
                  <AvatarFallback>
                    {getAvatarFallback(user?.username ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>@{user?.username ?? "username"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email ?? "email"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-0" asChild>
                <Button
                  variant={"ghost"}
                  className="py-0 w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" strokeWidth={2} />
                  <span>Log out</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
