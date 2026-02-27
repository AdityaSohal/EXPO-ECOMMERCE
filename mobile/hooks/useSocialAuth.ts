import { useSSO } from "@clerk/clerk-expo"
import { useState } from "react"
import { Alert } from "react-native"

function useSocialAuth() {
    const [isLoading,setIsLoading] = useState(false);
    const {startSS0Flow} = useSSO();
  return {isLoading,handleSocialAuth}
}

export default useSocialAuth