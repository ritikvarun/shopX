import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
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
            const token = localStorage.getItem("token")
            if (!token) {
                setUserData(null)
                setLoading(false)
                return
            }

            let result = await axios.get(serverUrl + "/api/user/getcurrentuser", {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            })

            setUserData(result.data)
            localStorage.setItem("userData", JSON.stringify(result.data))
            setLoading(false)

        } catch (error) {
            // Only clear if 401 (unauthorized), otherwise keep existing data
            if(error.response?.status === 401){
                setUserData(null)
                localStorage.removeItem("userData")
                localStorage.removeItem("token")
            } else {
                console.log("getCurrentUser error:", error.response?.data || error.message)
            }
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            localStorage.removeItem("userData")
            localStorage.removeItem("token")
            setUserData(null)
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
        } catch (error) {
            console.log("logout error:", error)
        } finally {
            localStorage.removeItem("userData")
            localStorage.removeItem("token")
            setUserData(null)
        }
    }

    useEffect(()=>{
     getCurrentUser()
    },[])

    let value = {
     userData,setUserData,getCurrentUser,logout,loading
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
