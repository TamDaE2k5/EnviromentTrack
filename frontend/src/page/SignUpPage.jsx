import { SignUpForm } from "@/components/auth/signup-form"
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  )
}
