import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, Image, Camera, BadgeCheck, Terminal } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ProfileSubmission from "../components/ProfileSubmission";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlaylistProfile from "../components/PlaylistProfile";
import AdminCreatedProblems from "../components/AdminCreatedProblems";

const Profile = () => {
  const { authUser, updateProfile } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setIsUpdating(true);
      await updateProfile({ image: base64Image });
      setIsUpdating(false);
    };
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-20 px-4 md:px-8 w-full relative overflow-hidden">
      {/* ═══════ DOT GRID BACKGROUND (Matching Home Page) ═══════ */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="z-10 w-full max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-12">
          <Link 
            to="/" 
            className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-base-200 border border-base-300 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 active:scale-95 shadow-xl shadow-black/20"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-base-content via-base-content/70 to-base-content bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-primary" />
              Manage your identity and learning progress
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Overview */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-base-200/50 backdrop-blur-xl border border-base-300 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-0 group-hover:bg-primary/10 transition-colors duration-500" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                {/* Avatar Section */}
                <div className="relative mb-6">
                  <div className="relative p-1 rounded-[2rem] bg-gradient-to-tr from-primary/50 via-white/10 to-transparent shadow-2xl">
                    <div className="w-32 h-32 rounded-[1.8rem] overflow-hidden bg-base-300/50 ring-4 ring-black/50 ring-offset-4 ring-offset-transparent">
                      {authUser?.image ? (
                        <img src={authUser.image} alt={authUser.name} className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-base-300/50">
                          <span className="text-5xl font-bold text-gray-700">{authUser?.name?.charAt(0) || "U"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Upload Trigger */}
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary hover:bg-primary-focus text-primary-content rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-primary/40 transform transition-all hover:scale-110 active:scale-95">
                    <Camera className="w-5 h-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdating} />
                  </label>
                  
                  {isUpdating && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[1.8rem] flex items-center justify-center">
                      <span className="loading loading-spinner loading-md text-primary"></span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-base-content mb-1">{authUser?.name}</h2>
                <div className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                  {authUser?.role}
                </div>

                <div className="w-full grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-base-300/50 border border-base-300 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Status</p>
                    <p className="text-xs text-success font-bold flex items-center justify-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      Active
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-base-300/50 border border-base-300 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Rank</p>
                    <p className="text-xs text-base-content font-bold">Member</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-base-200/50 backdrop-blur-xl border border-base-300 p-6 rounded-[2rem]">
              <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Security & Settings
              </h3>
              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl bg-base-300/50 hover:bg-base-300 border border-base-300 text-sm font-medium transition-all text-left px-4 flex items-center justify-between group">
                  Change Password
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                </button>
                <button className="w-full py-3 rounded-xl bg-base-300/50 hover:bg-base-300 border border-base-300 text-sm font-medium transition-all text-left px-4 flex items-center justify-between group">
                  Two-Factor Auth
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-error">Disabled</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Account Details & Activities */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-base-200/50 backdrop-blur-xl border border-base-300 p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-xl font-bold text-base-content mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-[1.5rem] bg-base-300/50 border border-base-300 pricing-card-hover group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] text-gray-500 group-hover:text-primary-focus transition-colors">Verified</span>
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Email Address</p>
                  <p className="text-base-content font-medium truncate">{authUser?.email}</p>
                </div>

                <div className="p-6 rounded-[1.5rem] bg-base-300/50 border border-base-300 pricing-card-hover group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Terminal className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[10px] text-gray-500">Public ID</span>
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">User Identifier</p>
                  <p className="text-base-content font-mono text-xs truncate">{authUser?.id}</p>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-[1.5rem] bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base-content font-bold">Administrator Access</h4>
                    <p className="text-xs text-gray-500">Manage problems, contests and user submissions</p>
                  </div>
                </div>
                {authUser?.role === "ADMIN" ? (
                  <span className="badge badge-success badge-sm font-bold">Enabled</span>
                ) : (
                  <span className="badge badge-ghost badge-sm opacity-50">Locked</span>
                )}
              </div>
            </div>

            {/* Activities Section */}
            <div className="space-y-8">
              {authUser?.role === "ADMIN" && <AdminCreatedProblems />}
              <ProfileSubmission />
              <ProblemSolvedByUser />
              <PlaylistProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;