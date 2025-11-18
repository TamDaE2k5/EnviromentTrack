import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"

export default function Page(){
    const navigate = useNavigate()

    const handleOnclick = (button) => {
        navigate(`/${button}`)
    }

    return(
        <>
            <h1 className="text-center text-emerald-600">Dùng dự án của chúng tôi 'EnviTrack' vì nó miễn phí</h1>
            <div>
                <Button onClick={() => handleOnclick('signup')} variant="custom">
                    Nhấn vào đây để đăng ký nếu bạn chưa có tài khoản
                </Button>
                <Button onClick={() => handleOnclick('login')} variant="custom">
                    Nhấn vào đây để đăng nhập nếu bạn có tài khoản rồi
                </Button>
            </div>
        </>
    )
}
