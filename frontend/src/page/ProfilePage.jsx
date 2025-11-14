import React, { useEffect, useState } from "react";
import { profileService } from "@/services/profileService";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await profileService.getProfile();
        
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);
  // console.log(user)
  if (!user) return <div>Loading...</div>;
  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user.nickName}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default ProfilePage;
