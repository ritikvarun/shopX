import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


const uploadOnCloudinary = async (filePath, folderName = "shopx") => {
    const cloudName = process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    cloudinary.config({ 
        cloud_name: cloudName, 
        api_key: apiKey, 
        api_secret: apiSecret 
    });

    try {
        if(!filePath){
            console.log("Cloudinary Upload Warning: No filePath provided");
            return null;
        }

        console.log(`Cloudinary: Uploading file '${filePath}' to folder '${folderName}'...`);

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: folderName,
            asset_folder: folderName,
            use_asset_folder_as_public_id: true,
            resource_type: "auto"
        });

        console.log("Cloudinary Upload Success! Secure URL:", uploadResult.secure_url);

        try{ fs.unlinkSync(filePath) } catch(e){ /* ignore unlink errors */ }
        return uploadResult.secure_url;
    } catch (error) {
        try{ if(filePath) fs.unlinkSync(filePath) } catch(e){}
        console.error("Cloudinary Upload Failed Error:", error.message || error);
        return null;
    }
}
export default uploadOnCloudinary