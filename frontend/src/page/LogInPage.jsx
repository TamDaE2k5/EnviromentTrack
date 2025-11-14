import { LogInForm } from "@/components/auth/login-form"

const LogInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <LogInForm />
      </div>
    </div>
  )
}

export default LogInPage