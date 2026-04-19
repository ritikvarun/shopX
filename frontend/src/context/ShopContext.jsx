import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './authContext'
import axios from 'axios'
import { userDataContext } from './UserContext'
import { toast } from 'react-toastify'

 export const shopDataContext = createContext()
function ShopContext({children}) {

    let [products,setProducts] = useState([])
    let [search,setSearch] = useState('')
    let {userData} = useContext(userDataContext)
    let [showSearch,setShowSearch] = useState(false)
    let {serverUrl} = useContext(authDataContext)
    let [cartItem, setCartItem] = useState({});
    let [loading,setLoading] = useState(false)
    let [settings, setSettings] = useState({}) // For dynamic images/banners
    let currency = '₹';
    let delivery_fee = 40;

    const getProducts = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/product/list")
            console.log(result.data)
            setProducts(result.data)
        } catch (error) {
            console.log(error)
        }
        
    }

    const fetchSettings = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/setting")
            setSettings(result.data)
        } catch (error) {
            console.log("Error fetching settings:", error)
        }
    }


    const addtoCart = async (itemId , size) => {
       if (!size) {
      toast.error("Select Product Size");
      return;
    }

    if (!userData) {
      toast.error("Please login to add items to cart");
      return;
    }

    let cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
  
    setCartItem(cartData);
  
    setLoading(true);
    try {
      let result = await axios.post(serverUrl + "/api/cart/add" , {itemId,size} , {withCredentials: true});
      console.log("Add to cart response:", result.data);
      toast.success("Product Added to Cart");
    } catch (error) {
      console.log("Add to cart error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add product to cart");
      // Revert cart state on error
      setCartItem(cartItem);
    } finally {
      setLoading(false);
    }
    }


    const getUserCart = async () => {
      try {
        const result = await axios.post(serverUrl + '/api/cart/get',{},{ withCredentials: true })
        console.log("Fetched cart data:", result.data); // Debug log
      setCartItem(result.data)
    } catch (error) {
      console.log(error)
    }
      
    }
    const updateQuantity = async (itemId , size , quantity) => {
      let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity
    setCartItem(cartData)

    if (userData) {
      try {
        await axios.post(serverUrl + "/api/cart/update", { itemId, size, quantity }, { withCredentials: true })
      } catch (error) {
        console.log(error)
        
      }
    }
      
    }
     const getCartCount = () => {
    let totalCount = 0;
    console.log("Cart Data:", cartItem); // Debug log
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            console.log(`Product: ${items}, Size: ${item}, Quantity: ${cartItem[items][item]}`); // Debug log
            totalCount += 1; // Count each unique product-size combination as 1
          }
        } catch (error) {

        }
      }
    }
    console.log("Total Count:", totalCount); // Debug log
    return totalCount
  }

  const getCartAmount = () => {
  let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalAmount += itemInfo.price * cartItem[items][item];
          }
        } catch (error) {

        }
      }
    }
    return totalAmount
    
  }

    useEffect(()=>{
     getProducts()
    },[])

    useEffect(() => {
    getUserCart()
    fetchSettings()
  },[])






    let value = {
      products, currency , delivery_fee,getProducts,search,setSearch,showSearch,setShowSearch,cartItem, addtoCart, getCartCount, setCartItem ,updateQuantity,getCartAmount,loading,settings
    }
  return (
    <div>
    <shopDataContext.Provider value={value}>
      {children}
      </shopDataContext.Provider>
    </div>
  )
}

export default ShopContext
