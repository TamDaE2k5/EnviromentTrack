import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} 
from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { Input } from '@/components/ui/input'
import { useNavigate } from "react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import { useForm } from "react-hook-form";

export function LogInForm({ ...props }) {
  const navigate = useNavigate();

  // Lấy function login từ store
  const { login, loading, error } = useAuthStore();
  const {register,handleSubmit,formState: { errors },} = useForm({});

  const setUser = useAuthStore((state) => state.setUser);

  const onSubmit = async (data) => {
    try {
      console.log(data)
      const res = await login({
        nickName: data.nickName,
        pw: data.password,
      });
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className={'text-center text-2xl'}>Chào mừng bạn đã quay lại!</CardTitle>
        <CardDescription>
          Để đăng nhập. Nhập thông tin của bạn theo đơn dưới đây.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
            {/* User name / Email */}
                <Label htmlFor="nickName" className=''>Tên tài khoản</Label>
                <Input placeholder='Tên đăng nhập' type={'text'} id='nickName' {...register('nickName')}/>
            </div>
            <div>
                {/* Password */}
                <Label htmlFor="password" className="">Mật khẩu</Label>
                <Input placeholder='Mật khẩu' type={'password'} id='password' {...register('password')}/>
            </div>
            <div>
                <Button className='w-full'>Đăng nhập</Button>
            </div>
            <div>
              <p>Nếu chưa có tài khoản, hãy <a href="/signup" className="text-card-foreground">đăng ký để bắt đầu!</a></p>
            </div>
        </form>
      </CardContent>
    </Card>
  )
}
