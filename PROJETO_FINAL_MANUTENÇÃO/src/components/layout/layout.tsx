"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  List,
  Settings,
  HardDrive,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      id: "dashboard",
    },
    {
      name: "Funcionários",
      icon: <Users className="w-5 h-5" />,
      id: "employees",
    },
    {
      name: "Categorias",
      icon: <List className="w-5 h-5" />,
      id: "categories",
    },
    {
      name: "Equipamentos",
      icon: <HardDrive className="w-5 h-5" />,
      id: "equipment",
    },
    {
      name: "Categorias de Inspeção",
      icon: <ClipboardList className="w-5 h-5" />,
      id: "inspection-categories",
    },
    {
      name: "Checklists",
      icon: <ClipboardCheck className="w-5 h-5" />,
      id: "checklists",
    },
    {
      name: "Ordens de Serviço",
      icon: <FileText className="w-5 h-5" />,
      id: "service-orders",
    },
    {
      name: "Empresa",
      icon: <Building className="w-5 h-5" />,
      id: "company",
    },
    {
      name: "Configurações",
      icon: <Settings className="w-5 h-5" />,
      id: "settings",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar-background border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-primary">
            Sistema OS Preventivas
          </h1>
        </div>

        <nav className="p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 mb-1 rounded-md text-sm transition-colors",
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-6">
          <h2 className="text-lg font-medium">
            {navItems.find((item) => item.id === activeTab)?.name || "Dashboard"}
          </h2>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
