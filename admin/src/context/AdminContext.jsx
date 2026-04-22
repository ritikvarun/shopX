import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const adminDataContext = createContext()
function AdminContext({children}) {
    let [adminData,setAdminData] = useState(null)
    let [loading,setLoading] = useState(true)
    let {serverUrl} = useContext(authDataContext)


    const getAdmin = async () => {
      try {
           console.log("Fetching admin data...")
           let result = await axios.get(serverUrl + "/api/user/getadmin",{withCredentials:true})

      setAdminData(result.data)
      console.log("getAdmin result:", result.data)
      setLoading(false)
      } catch (error) {
        console.log("getAdmin error:", error.response?.data || error.message)
        // Keep existing adminData instead of setting to null on error
        setLoading(false)
      }
    }

    useEffect(()=>{
     getAdmin()
    },[])


    let value = {
adminData,setAdminData,getAdmin,loading
    }
  return (
    <div>
<adminDataContext.Provider value={value}>
    {children}
</adminDataContext.Provider>
      
    </div>
  )
}

export default AdminContext