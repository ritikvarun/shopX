import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './authContext'
import axios from 'axios'

export const userDataContext = createContext()
function UserContext({children}) {
    let [userData,setUserData] = useState(() => {
        // Try to load from localStorage on init
        try {
            const saved = localStorage.getItem("userData")
            return saved ? JSON.parse(saved) : null
        } catch (e) {
            return null
        }
    })
    let [loading, setLoading] = useState(true)
    let {serverUrl} = useContext(authDataContext)


   const getCurrentUser = async () => {
        try {
            console.log("Fetching current user from:", serverUrl + "/api/user/getcurrentuser")
            let result = await axios.get(serverUrl + "/api/user/getcurrentuser",{withCredentials:true})

            setUserData(result.data)
            localStorage.setItem("userData", JSON.stringify(result.data))
            console.log("Current user fetched:", result.data)
            setLoading(false)

        } catch (error) {
            console.log("getCurrentUser error:", error.response?.data || error.message)
            // Only clear if 401 (unauthorized), otherwise keep existing data
            if(error.response?.status === 401){
                setUserData(null)
                localStorage.removeItem("userData")
            }
            setLoading(false)
        }
    }

    useEffect(()=>{
     getCurrentUser()
    },[])



    let value = {
     userData,setUserData,getCurrentUser,loading
    }
    
   
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
