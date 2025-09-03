import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Activity, 
  Heart, 
  Pill, 
  Calendar, 
  BookOpen, 
  Stethoscope,
  Shield,
  Menu,
  LogOut,
  Loader2,
  UserIcon
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
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import LoginSplash from "../components/auth/LoginSplash";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Activity,
    color: "text-blue-600"
  },
  {
    title: "Symptom Analysis", 
    url: createPageUrl("Symptoms"),
    icon: Stethoscope,
    color: "text-red-500"
  },
  {
    title: "Medications",
    url: createPageUrl("Medications"),
    icon: Pill,
    color: "text-green-600"
  },
  {
    title: "Appointments",
    url: createPageUrl("Appointments"),
    icon: Calendar,
    color: "text-purple-600"
  },
  {
    title: "Health Journal",
    url: createPageUrl("Journal"),
    icon: BookOpen,
    color: "text-indigo-600"
  },
  {
    title: "Vital Signs",
    url: createPageUrl("Vitals"),
    icon: Heart,
    color: "text-pink-600"
  },
  {
    title: "Health Profile",
    url: createPageUrl("Profile"),
    icon: UserIcon,
    color: "text-teal-600"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  if (authLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginSplash />;
  }

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --medical-blue: #1e40af;
            --medical-green: #059669;
            --medical-gray: #64748b;
            --surface-white: #ffffff;
            --surface-light: #f8fafc;
            --surface-subtle: #f1f5f9;
            --border-color: #e2e8f0;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20">
        <Sidebar className="border-r border-slate-200/60 bg-white/95 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">HealthWise</h2>
                <p className="text-xs text-slate-500 font-medium">Personal Wellness Assistant</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Health Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`group relative overflow-hidden rounded-xl transition-all duration-300 mb-1 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 shadow-sm' 
                              : 'hover:bg-slate-50 hover:translate-x-1'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-4 px-4 py-3 relative">
                            <item.icon className={`w-5 h-5 ${isActive ? item.color : 'text-slate-400 group-hover:text-slate-600'} transition-colors duration-200`} />
                            <span className={`font-medium ${isActive ? 'text-slate-900' : 'text-slate-600'} transition-colors duration-200`}>
                              {item.title}
                            </span>
                            {isActive && (
                              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-green-500 rounded-r"></div>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Emergency
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="mx-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <Shield className="w-4 h-4" />
                    <span className="font-semibold text-sm">Emergency Info</span>
                  </div>
                  <p className="text-xs text-red-600 leading-relaxed">
                    Quick access to your medical profile and emergency contacts when needed.
                  </p>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{user.full_name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SidebarTrigger>
                        <Menu className="w-5 h-5 text-slate-600" />
                    </SidebarTrigger>
                    <h1 className="text-xl font-bold text-slate-900">HealthWise</h1>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {React.cloneElement(children, { user })}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}