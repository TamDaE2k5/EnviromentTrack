import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const SignUpSchema = z.object({
  name: z.string().min(2, "Tên không hợp lệ!"),
  nickName: z.string().min(2, "Tên tài khoản không hợp lệ!"),
  password: z.string().min(8, "Mật khẩu ít nhất phải 8 kí tự"),
  email: z.email("Email không hợp lệ!"), 
  city: z.string().min(1, "Tên thành phố không hợp lệ!"),
  country: z.string().min(2, "Tên quốc gia không hợp lệ!"),
});

export function SignUpForm({ ...props }) {
  const [cities, setCities] = useState({});
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  // phai destructing vi ko phai object tinh
  const { register: registerUser, loading, error } = useAuthStore();
  const navigate = useNavigate();
  // Đọc dữ liệu cities.json khi khởi động
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

  const {register,handleSubmit,formState: { errors, isSubmitting },} = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data) => {
    console.log("Dữ liệu người dùng:", data);
    try {
      const res = await registerUser({
        name: data.name,
        nickName: data.nickName,
        pw: data.password, // đổi key password thành pw
        email: data.email,
        country: data.country,
        city: data.city,
      });
      console.log("Đăng ký thành công:", res);
      navigate("/login");
    } catch (err) {
      console.error("Đăng ký thất bại:", err.response?.data || err.message);
    }
  };

  return (
    <>
    <Card {...props}>
      <CardHeader>
        <CardTitle className='font-bold text-center text-3xl'>Tạo tài khoản</CardTitle>
        <CardDescription className={'text-center'}>
          Để đăng ký, nhập thông tin của bạn theo mẫu dưới đây.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Họ tên */}
          <div>
            <Label htmlFor="name">Họ tên</Label>
            <Input placeholder='Họ và tên' type="text" id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="nickName">Tên tài khoản</Label>
            <Input placeholder='Tên đăng nhập' type="text" id="nickName" {...register("nickName")} />
            {errors.nickName && (
              <p className="text-red-500 text-sm">{errors.nickName.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input placeholder='Mật khẩu' type="password" id="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input placeholder='Email' type="email" id="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* City + Country (same row) */}
          <div className="flex gap-4">
            {/* Country */}
            <div className="flex-1">
              <Label htmlFor="country">Quốc gia</Label>
              <select
                id="country"
                {...register("country")}
                onChange={(e) => {
                  const selected = e.target.value;
                  setSelectedCountry(selected);
                  // Gọi hàm setValue của react-hook-form nếu cần
                  setValue("country", selected);
                }}
                className="w-full border rounded p-2"
              >
                <option value="">-- Chọn quốc gia --</option>
                {countries.map((country, i) => (
                  <option key={i} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>

            {/* City */}
            <div className="flex-1">
              <Label htmlFor="city">Tên thành phố</Label>
              <select
                id="city"
                {...register("city")}
                className="w-full border rounded p-2"
              >
                <option value="">-- Chọn thành phố --</option>
                {filteredCities.map((city, i) => (
                  <option key={i} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
          </div>
          <div>
            {/* Submit */}
            <Button className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </div>

          <div>
            <p className="text-xs text-inherit">Nếu đã có tài khoản, <a href="/login" className="text-card-foreground">đăng nhập tại đây!</a></p>
          </div>
        </form>
      </CardContent>
      <div className=" text-xs px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
        Bằng cách tiếp tục, bạn sẽ đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </Card>
    </>
  );
}
