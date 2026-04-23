"use client";
import React, { useState } from "react";
import { User, Globe, Shield, Server } from "lucide-react";
import ProfilePage from "./profile/page";
import GeneralSettings from "./general-settings/page";
import Security from "./security/page";
import PageHeader from "@/components/shared/PageHeader";

const navItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "general", label: "General Settings", icon: Globe },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  const renderContent = () => {
    if (active === "profile") return <ProfilePage />;
    if (active === "general") return <GeneralSettings />;
    if (active === "security") return <Security />;
  };

  return (
    <div>
      <div className="mb-6">
        <PageHeader title="Settings" description="Global platform configuration" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full space-y-1 lg:w-80 lg:shrink-0">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium transition-colors cursor-pointer ${active === id
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}

          {/* System Status Card */}
          <div className="mt-4 bg-blue-600 rounded-xl p-3 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Server className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">System Status</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Server Load</span>
                  <span>22%</span>
                </div>
                <div className="h-1.5 bg-blue-400 rounded-full">
                  <div className="h-1.5 bg-green-400 rounded-full" style={{ width: "22%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Storage</span>
                  <span>95.85%</span>
                </div>
                <div className="h-1.5 bg-blue-400 rounded-full">
                  <div className="h-1.5 bg-yellow-400 rounded-full" style={{ width: "95.85%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">{renderContent()}</div>
      </div>
    </div>
  );
}