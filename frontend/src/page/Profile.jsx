import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, Image, Camera } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ProfileSubmission from "../components/ProfileSubmission";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlaylistProfile from "../components/PlaylistProfile";

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
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-start py-10 px-4 md:px-8 w-full">
      {/* Header with back button */}
      <div className="flex flex-row justify-between items-center w-full mb-6">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
        </div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group cursor-pointer">
                <div className={`avatar placeholder ${isUpdating ? "opacity-50" : ""}`}>
                  <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden relative">
                    {authUser.image ? (
                      <img src={authUser.image} alt={authUser.name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-3xl">{authUser.name ? authUser.name.charAt(0) : "U"}</span>
                    )}
                  </div>
                </div>
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white mb-1" />
                  <span className="text-[10px] text-white">Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdating}
                  />
                </label>
              </div>
              
              {/* Name and Role Badge */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{authUser.name}</h2>
                <div className="badge badge-primary mt-2">{authUser.role}</div>
              </div>
            </div>
            
            <div className="divider"></div>
            
            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-base-200 rounded-box p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-base-content/60 text-sm font-semibold mb-1">Email</div>
                  <div className="text-lg font-bold break-all">{authUser.email}</div>
                </div>
                <div className="text-primary flex-shrink-0">
                  <Mail className="w-8 h-8" />
                </div>
              </div>
              
              {/* User ID */}
              <div className="bg-base-200 rounded-box p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-base-content/60 text-sm font-semibold mb-1">User ID</div>
                  <div className="text-sm font-bold break-all">{authUser.id}</div>
                </div>
                <div className="text-primary flex-shrink-0">
                  <User className="w-8 h-8" />
                </div>
              </div>
              
              {/* Role Status */}
              <div className="bg-base-200 rounded-box p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-base-content/60 text-sm font-semibold mb-1">Role</div>
                  <div className="text-lg font-bold">{authUser.role}</div>
                  <div className="text-xs text-base-content/60 mt-1">
                    {authUser.role === "ADMIN" ? "Full system access" : "Limited access"}
                  </div>
                </div>
                <div className="text-primary flex-shrink-0">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              
              {/* Profile Image Status */}
              <div className="bg-base-200 rounded-box p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-base-content/60 text-sm font-semibold mb-1">Profile Image</div>
                  <div className="text-lg font-bold">
                    {authUser.image ? "Uploaded" : "Not Set"}
                  </div>
                  <div className="text-xs text-base-content/60 mt-1">
                    {authUser.image ? "Image available" : "Upload a profile picture"}
                  </div>
                </div>
                <div className="text-primary flex-shrink-0">
                  <Image className="w-8 h-8" />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="card-actions justify-end mt-6">
              <label className={`btn btn-outline btn-primary cursor-pointer ${isUpdating ? "loading" : ""}`}>
                {!isUpdating && <Camera className="w-4 h-4 mr-1"/>}
                Update Picture
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdating}
                  />
              </label>
              <button className="btn btn-primary">Change Password</button>
            </div>
          </div>
        </div>
        
     
      </div>
      <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col gap-8">
        <ProfileSubmission/>
        <ProblemSolvedByUser/>
        <PlaylistProfile/>
      </div>
      
      {/* PLaylist created by the user and their actions */}
    </div>
  );
};

export default Profile;