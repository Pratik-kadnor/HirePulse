import React from 'react';
import {
  Calendar,
  Home,
  User,
  Briefcase,
  FileText,
  BrainCog,
  Settings,
  HelpCircle,
  LogOut,
  Code2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Dashboard",
    url: "/app",
    icon: Home,
  },
  {
    title: "Interview",
    url: "/app/interview",
    icon: BrainCog,
    active: true,
  },
  {
    title: "Top 75 LeetCode",
    url: "/app/top75",
    icon: Code2,
  },
  {
    title: "Resume",
    url: "/app/resume",
    icon: FileText,
  },
  {
    title: "Job Recommentation",
    url: "/app/job",
    icon: Briefcase,
  },
];

const generalItems = [
  {
    title: "Profile",
    url: "#",
    icon: User,
  },
  {
    title: "Setting",
    url: "#",
    icon: Settings,
  },
];

import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@/context/UserContext';

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useUser();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL_NODE}/api/users/logout`);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearUser();
      navigate('/login');
    }
  };

  return (
    <div className="relative h-full">
      <Sidebar className="bg-[#121212] text-gray-300 border-r border-gray-800 h-full flex flex-col">
        <SidebarContent className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 py-4 mb-4">

            <span className="truncate font-semibold text-lg text-primary">Get Placed</span>
          </div>

          {/* Main menu */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 text-sm text-gray-400">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg ${location.pathname === item.url
                          ? "bg-purple-600 text-white"
                          : "hover:bg-gray-800 hover:text-white"
                          } transition-all`}
                      >
                        <item.icon className={`w-5 h-5 ${item.active ? "text-white" : "text-gray-400"}`} />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* General menu */}
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-4 py-2 text-sm text-gray-400">
              General
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {generalItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-all"
                      >
                        <item.icon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Dotted pattern background */}
          <div className="relative flex-grow overflow-hidden">
            <div className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)',
                backgroundSize: '12px 12px'
              }} />
          </div>

          {/* User chip */}
          {user && (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                  <p className="text-gray-500 text-[10px] truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Logout button */}
          <div className="mb-4 px-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}