"use client"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import { useState } from "react"

const GoogleButton = () => {

    const [isLoading , setIsLoading] = useState(false)

    const handleLogin = async() => {
        try {
            setIsLoading(true)
            await signIn("google")
        } catch (error) {
            toast.error("Something went wrong with your login")
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }



  return (
      <button disabled={isLoading} onClick={handleLogin} className="btn bg-white text-black border-[#e5e5e5] w-full">
          {isLoading ? null : <div className="flex justify-center items-center gap-2"><svg aria-label="Google logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>Login with Google</div>}{isLoading && (<span className="loading loading-spinner loading-sm"></span>)}
      </button>
  )
}

export default GoogleButton