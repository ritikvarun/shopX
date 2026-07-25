import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


const uploadOnCloudinary = async (filePath, folderName = "shopx") => {
    const cloudName = process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;

    if (process.env.CLOUDINARY_URL) {
        cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
    } else {
        cloudinary.config({ 
            cloud_name: cloudName, 
            api_key: apiKey, 
            api_secret: apiSecret 
        });
    }

    try {
        if(!filePath){
            console.log("Cloudinary Upload Warning: No filePath provided");
            return null;
        }

        if (!cloudName && !process.env.CLOUDINARY_URL) {
            console.error("Cloudinary Error: No Cloud Name found in env! Check CLOUDINARY_NAME / CLOUDINARY_CLOUD_NAME");
            return null;
        }

        console.log(`Cloudinary: Uploading file '${filePath}' to Cloud Name '${cloudName}' in folder '${folderName}'...`);

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: folderName,
            asset_folder: folderName,
            use_asset_folder_as_public_id: true,
            resource_type: "auto"
        });

        console.log(`Cloudinary Upload Success to [${cloudName}]! Secure URL:`, uploadResult.secure_url);

        try{ fs.unlinkSync(filePath) } catch(e){ /* ignore unlink errors */ }
        return uploadResult.secure_url;
    } catch (error) {
        try{ if(filePath) fs.unlinkSync(filePath) } catch(e){}
        console.error("Cloudinary Upload Failed Error:", error.message || error);
        return null;
    }
}
export default uploadOnCloudinary