import uploadOnCloudinary from "../config/cloudinary.js"
import Product from "../model/productModel.js"


export const addProduct = async (req,res) => {
    try {
        console.log("addProduct called")
        console.log("req.body:", req.body)
        console.log("req.files:", req.files)

        let {name,description,price,category,subCategory,sizes,bestseller} = req.body

        if(!name || !description || !price || !category || !subCategory || !sizes){
            return res.status(400).json({message:"All fields are required"})
        }

        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({message:"No files received: check multipart/form-data and that files are attached"})
        }

        // Helper to get file path for expected image fields
        const getFilePath = (field) => {
            if(req.files[field] && Array.isArray(req.files[field]) && req.files[field].length > 0){
                return req.files[field][0].path
            }
            return null
        }

        const missing = []
        const image1Path = getFilePath('image1'); if(!image1Path) missing.push('image1')
        const image2Path = getFilePath('image2'); if(!image2Path) missing.push('image2')
        const image3Path = getFilePath('image3'); if(!image3Path) missing.push('image3')
        const image4Path = getFilePath('image4'); if(!image4Path) missing.push('image4')

        if(missing.length > 0){
            return res.status(400).json({message:`Missing file fields: ${missing.join(', ')}`})
        }

        let image1 = await uploadOnCloudinary(image1Path)
        let image2 = await uploadOnCloudinary(image2Path)
        let image3 = await uploadOnCloudinary(image3Path)
        let image4 = await uploadOnCloudinary(image4Path)

        if(!image1 || !image2 || !image3 || !image4){
            return res.status(500).json({message:"Upload failed for one or more images"})
        }
        
        let productData = {
            name,
            description,
            price :Number(price),
            category,
            subCategory,
            sizes :JSON.parse(sizes),
            bestseller :bestseller === "true" ? true : false,
            date :Date.now(),
            image1,
            image2,
            image3,
            image4
            
        }

        const product = await Product.create(productData)
        console.log("Product created:", product)

        return res.status(201).json(product)

    } catch (error) {
          console.log("AddProduct error:", error)
    return res.status(500).json({message:`AddProduct error ${error.message}`})
    }
    
}


export const listProduct = async (req,res) => {
     
    try {
        const product = await Product.find({});
        return res.status(200).json(product)

    } catch (error) {
        console.log("ListProduct error")
    return res.status(500).json({message:`ListProduct error ${error}`})
    }
}

export const removeProduct = async (req,res) => {
    try {
        let {id} = req.params;
        const product = await Product.findByIdAndDelete(id)
         return res.status(200).json(product)
    } catch (error) {
        console.log("RemoveProduct error")
    return res.status(500).json({message:`RemoveProduct error ${error}`})
    }
    
}
