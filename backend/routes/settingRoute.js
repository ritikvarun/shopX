import express from "express"
import { getSettings, updateSettingImage } from "../controller/settingController.js"
import adminAuth from "../middleware/adminAuth.js"
import upload from "../middleware/multer.js"
import Setting from '../model/settingModel.js'

const settingRouter = express.Router()

// Public route to fetch settings (for frontend)
settingRouter.get("/", getSettings)
settingRouter.put('/:key', adminAuth, async (req, res) => {
    const { key } = req.params
    const { value } = req.body
    if (!['heroBanners', 'homeSections', 'customCategories'].includes(key) || !Array.isArray(value) || value.length > 100) return res.status(400).json({ message: 'Invalid settings' })
    if (key === 'heroBanners' && value.length !== 5) return res.status(400).json({ message: 'Five banner slots are required' })
    if (value.some(item => !item || typeof item.title !== 'string' || !item.title.trim() || item.title.length > 150 || (key !== 'heroBanners' && (!Array.isArray(item.productIds) || item.productIds.some(id => !/^[a-f0-9]{24}$/i.test(id)))) || (item.image && !/^https?:\/\//i.test(item.image)))) return res.status(400).json({ message: 'Check titles, image URLs and selected products' })
    if (key === 'homeSections' && value.some(item => (item.layout && !['grid','editorial','carousel','spotlight'].includes(item.layout)) || (item.subtitle != null && (typeof item.subtitle !== 'string' || item.subtitle.length > 500)) || (item.cta != null && (typeof item.cta !== 'string' || item.cta.length > 80)))) return res.status(400).json({ message: 'Invalid section layout or text' })
    try {
        await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
        res.json({ value })
    } catch { res.status(500).json({ message: 'Could not save settings' }) }
})

// Admin route to update an image setting
settingRouter.post("/update-image", adminAuth, upload.fields([{ name: 'image', maxCount: 1 }]), updateSettingImage)

export default settingRouter
