import React, { useEffect, useState } from "react";
import { profileService } from "@/services/profileService";
import Logout from "@/components/auth/logout";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const ProfilePage = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const handleUpdateLocation = async () => {
    try {
      await profileService.updateProfile({
        city: selectedCity,
        country: selectedCountry,
      });
      toast.success('Đổi địa chỉ thành công!')
    } catch (err) {
      toast.error('Đổi địa chỉ thất bại')
      console.error(err);
    }
  };
  const [cities, setCities] = useState({});
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch("/cities.json")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        // Tự lấy danh sách quốc gia duy nhất
        const uniqueCountries = [
          ...new Set(Object.values(data).map((c) => c.country)),
        ];
        setCountries(uniqueCountries);
      });
  }, []);

  // Cập nhật danh sách thành phố khi chọn quốc gia
  useEffect(() => {
    if (selectedCountry) {
      const filtered = Object.values(cities)
        .filter((c) => c.country === selectedCountry)
        .map((c) => c.name);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [selectedCountry, cities]);
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
  <div className="relative min-h-screen p-6">

    {/* Nút Logout trên góc phải */}
    <div className="absolute top-4 right-4">
      <Logout />
    </div>

    {/* Thông tin user */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold">Xin chào!</h1>
      <p className="text-lg">
        Tên người dùng: <span className="font-semibold">{user?.nickName}</span>
      </p>
      <p className="text-lg">
        Email: <span className="font-semibold">{user?.email}</span>
      </p>
    </div>

    {/* Layout 2 card cạnh nhau */}
    <div className="flex gap-6 items-start">

      {/* Card bên trái - thông tin đang theo dõi */}
      <div className="max-w-sm w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              Bạn đang theo dõi:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label><b>Thành phố:</b> {user?.city ?? "Chưa có"}</Label>
              <Label><b>Quốc gia:</b> {user?.country ?? "Chưa có"}</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card bên phải - Form chọn quốc gia và thành phố */}
      <div className="max-w-sm w-full ml-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              Thay đổi địa điểm theo dõi
            </CardTitle>
            <CardDescription className="text-center">
              Chọn quốc gia trước rồi chọn thành phố.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4">

              {/* Select Country */}
              <div>
                <Label htmlFor="country">Quốc gia</Label>
                <select
                  id="country"
                  className="w-full p-2 border rounded-md"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">-- Chọn quốc gia --</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Select City */}
              <div>
                <Label htmlFor="city">Thành phố</Label>
                <select
                  id="city"
                  className="w-full p-2 border rounded-md"
                  disabled={!selectedCountry}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">-- Chọn thành phố --</option>
                  {filteredCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <button
                  onClick={handleUpdateLocation}
                  type="button"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  disabled={!selectedCity || !selectedCountry}
                >
                  Lưu thay đổi
                </button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);


};

export default ProfilePage;
