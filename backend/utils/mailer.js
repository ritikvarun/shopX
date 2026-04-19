import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

// ── Transporter ──────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// ── Helper: send email safely (never crashes server) ─────────
const sendMail = async (options) => {
    try {
        await transporter.sendMail(options)
        console.log(`✅ Email sent to: ${options.to}`)
    } catch (err) {
        console.error(`❌ Email failed to ${options.to}:`, err.message)
    }
}

// ── 1. User: Order Confirmation ──────────────────────────────
export const sendOrderConfirmation = async (userEmail, userName, items, totalAmount, orderId) => {
    const itemRows = items.map(item => `
        <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.size}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">₹${item.price}</td>
        </tr>
    `).join('')

    await sendMail({
        from: `"ShopX" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: '✅ Order Confirmed — ShopX',
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#000;padding:24px 32px;">
                <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:-0.5px;">ShopX</h1>
            </div>
            <div style="padding:32px;">
                <h2 style="margin:0 0 8px;color:#111;font-size:20px;">Order Confirmed! 🎉</h2>
                <p style="color:#6b7280;margin:0 0 24px;">Hi <b>${userName}</b>, thank you for your order.</p>
                <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden;">
                    <thead>
                        <tr style="background:#f3f4f6;">
                            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;">Product</th>
                            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase;">Size</th>
                            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase;">Qty</th>
                            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase;">Price</th>
                        </tr>
                    </thead>
                    <tbody>${itemRows}</tbody>
                </table>
                <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px;display:flex;justify-content:space-between;">
                    <span style="font-weight:600;color:#111;">Total Amount</span>
                    <span style="font-weight:700;color:#111;font-size:18px;">₹${totalAmount}</span>
                </div>
                <p style="color:#6b7280;margin-top:24px;font-size:14px;">
                    We'll notify you when your order ships.<br/>
                    Order ID: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px;">${orderId}</code>
                </p>
            </div>
            <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
                <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 ShopX. All rights reserved.</p>
            </div>
        </div>`
    })
}

// ── 2. Admin: New Order Alert ─────────────────────────────────
export const sendAdminOrderAlert = async (orderDetails) => {
    const { userName, userEmail, items, amount, address, paymentMethod, orderId } = orderDetails
    const itemList = items.map(i => `<li>${i.name} (${i.size}) × ${i.quantity} — ₹${i.price}</li>`).join('')

    await sendMail({
        from: `"ShopX Alerts" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🛒 New Order Received — ₹${amount} — ShopX`,
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#000;padding:24px 32px;">
                <h1 style="color:#fff;margin:0;font-size:22px;">ShopX Admin</h1>
                <span style="background:#22c55e;color:#fff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;display:inline-block;margin-top:8px;">New Order</span>
            </div>
            <div style="padding:32px;">
                <h2 style="margin:0 0 20px;color:#111;">New Order Alert 🛒</h2>
                <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:12px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;font-weight:600;">Customer</p>
                    <p style="margin:0;color:#111;font-weight:600;">${userName}</p>
                    <p style="margin:0;color:#6b7280;font-size:14px;">${userEmail}</p>
                </div>
                <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:12px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;font-weight:600;">Delivery Address</p>
                    <p style="margin:0;color:#111;">${address.street}, ${address.city} — ${address.pinCode}</p>
                    <p style="margin:0;color:#6b7280;font-size:14px;">📞 ${address.phone}</p>
                </div>
                <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:12px;">
                    <p style="margin:0 0 8px;font-size:12px;color:#6b7280;text-transform:uppercase;font-weight:600;">Items Ordered</p>
                    <ul style="margin:0;padding-left:20px;color:#374151;font-size:14px;">${itemList}</ul>
                </div>
                <div style="padding:16px;background:#000;border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
                    <span style="color:#d1d5db;font-weight:600;">Total · ${paymentMethod}</span>
                    <span style="color:#fff;font-weight:700;font-size:20px;">₹${amount}</span>
                </div>
                <div style="margin-top:20px;text-align:center;">
                    <a href="${process.env.ADMIN_URL || 'http://localhost:5174'}/orders"
                       style="background:#000;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
                        View in Admin Panel →
                    </a>
                </div>
                <p style="color:#9ca3af;font-size:12px;margin-top:16px;">Order ID: ${orderId}</p>
            </div>
        </div>`
    })
}

// ── 3. User: Order Status Update ─────────────────────────────
export const sendStatusUpdate = async (userEmail, userName, orderStatus, orderId) => {
    const statusEmoji = {
        'Order Placed': '📋',
        'Packing': '📦',
        'Shipped': '🚚',
        'Out for delivery': '🛵',
        'Delivered': '✅'
    }
    const emoji = statusEmoji[orderStatus] || '📦'

    await sendMail({
        from: `"ShopX" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `${emoji} Order Update: ${orderStatus} — ShopX`,
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#000;padding:24px 32px;">
                <h1 style="color:#fff;margin:0;font-size:22px;">ShopX</h1>
            </div>
            <div style="padding:32px;text-align:center;">
                <div style="font-size:48px;margin-bottom:16px;">${emoji}</div>
                <h2 style="color:#111;margin:0 0 8px;">Your order is now:<br/><span style="color:#000;">${orderStatus}</span></h2>
                <p style="color:#6b7280;margin:0 0 24px;">Hi ${userName}, we've updated your order status.</p>
                <p style="color:#9ca3af;font-size:13px;">Order ID: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">${orderId}</code></p>
            </div>
            <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
                <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 ShopX. All rights reserved.</p>
            </div>
        </div>`
    })
}

// ── 4. User: Return/Replacement Request Confirmation ─────────────────
export const sendReturnRequestEmail = async (userEmail, userName, { itemName, reason, actionType, returnId }) => {
    await sendMail({
        from: `"ShopX Support" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Your ${actionType} Request is Received — ShopX`,
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#000;padding:24px 32px;">
                <h1 style="color:#fff;margin:0;font-size:22px;">ShopX</h1>
            </div>
            <div style="padding:32px;">
                <div style="font-size:40px;margin-bottom:12px;">🔄</div>
                <h2 style="margin:0 0 8px;color:#111;">${actionType} Request Received</h2>
                <p style="margin:0 0 20px;color:#6b7280;">Hi <b>${userName}</b>, we’ve got your request to ${actionType.toLowerCase()} this item.</p>
                <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:16px;">
                    <p style="margin:0 0 8px;font-size:12px;color:#6b7280;text-transform:uppercase;font-weight:600;">Return Details</p>
                    <p style="margin:0 0 4px;color:#111;"><b>Item:</b> ${itemName}</p>
                    <p style="margin:0;color:#111;"><b>Reason:</b> ${reason}</p>
                </div>
                <div style="background:#fef3c7;border-radius:8px;padding:12px 16px;">
                    <p style="margin:0;color:#92400e;font-size:13px;">⏱ Please keep the item ready for pickup. Our team will contact you soon.</p>
                </div>
                <p style="color:#9ca3af;font-size:12px;margin-top:16px;">Return ID: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">${returnId}</code></p>
            </div>
            <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
                <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 ShopX. All rights reserved.</p>
            </div>
        </div>`
    })
}

// ── 5. Admin: Return Alert ────────────────────────────────────
export const sendAdminReturnAlert = async (adminEmail, { userName, userEmail, itemName, reason, description, actionType, refundMethod, refundDetails, returnId }) => {
    await sendMail({
        from: `"ShopX Alerts" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `↩️ New ${actionType} Request — ${itemName} — ShopX`,
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#000;padding:24px 32px;">
                <h1 style="color:#fff;margin:0;font-size:22px;">ShopX Admin</h1>
                <span style="background:#ef4444;color:#fff;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;display:inline-block;margin-top:8px;">${actionType} Request</span>
            </div>
            <div style="padding:32px;">
                <h2 style="margin:0 0 20px;color:#111;">↩️ New ${actionType} Request</h2>
                <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:12px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;font-weight:600;">Customer</p>
                    <p style="margin:0;color:#111;font-weight:600;">${userName}</p>
                    <p style="margin:0;color:#6b7280;font-size:14px;">${userEmail}</p>
                </div>
                <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:12px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;font-weight:600;">Item</p>
                    <p style="margin:0;color:#111;font-weight:600;">${itemName}</p>
                    <p style="margin:0;color:#374151;font-size:14px;">Reason: ${reason}</p>
                    ${description ? `<p style="margin:4px 0 0;color:#6b7280;font-size:13px;">${description}</p>` : ''}
                </div>
                ${actionType === 'Refund' ? `
                <div style="background:#fef3c7;padding:16px;border-radius:8px;margin-bottom:12px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#92400e;text-transform:uppercase;font-weight:600;">Refund Preference (${refundMethod})</p>
                    ${refundMethod === 'UPI' 
                        ? `<p style="margin:0;color:#111;font-size:14px;"><b>UPI ID:</b> ${refundDetails.upiId}</p>` 
                        : `<p style="margin:0;color:#111;font-size:14px;"><b>Account Name:</b> ${refundDetails.accountName}<br/><b>Acct No:</b> ${refundDetails.accountNo}<br/><b>IFSC:</b> ${refundDetails.ifsc}</p>`
                    }
                </div>` : `
                <div style="background:#ede9fe;padding:16px;border-radius:8px;margin-bottom:12px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#5b21b6;text-transform:uppercase;font-weight:600;">Action Required</p>
                    <p style="margin:0;color:#111;font-size:14px;">Customer requested a <b>Replacement</b>.</p>
                </div>
                `}
                <div style="margin-top:20px;text-align:center;">
                    <a href="${process.env.ADMIN_URL || 'http://localhost:5174'}/returns"
                       style="background:#000;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
                        View Returns Panel →
                    </a>
                </div>
                <p style="color:#9ca3af;font-size:12px;margin-top:16px;">Return ID: ${returnId}</p>
            </div>
        </div>`
    })
}

// ── 6. User: Return Status Update ────────────────────────────
export const sendReturnStatusEmail = async (userEmail, userName, { status, adminNote, itemName, returnId }) => {
    const isApproved = status === 'Approved'
    const emoji = isApproved ? '✅' : '❌'
    const color = isApproved ? '#22c55e' : '#ef4444'
    const message = isApproved
        ? 'Your return has been approved! Our team will arrange pickup soon. Refund in 5-7 business days.'
        : 'Unfortunately, your return request has been rejected.'

    await sendMail({
        from: `"ShopX" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `${emoji} Return ${status} — ${itemName} — ShopX`,
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <div style="background:#000;padding:24px 32px;">
                <h1 style="color:#fff;margin:0;font-size:22px;">ShopX</h1>
            </div>
            <div style="padding:32px;text-align:center;">
                <div style="font-size:48px;margin-bottom:12px;">${emoji}</div>
                <h2 style="color:#111;margin:0 0 8px;">Return <span style="color:${color};">${status}</span></h2>
                <p style="color:#6b7280;margin:0 0 20px;">Hi <b>${userName}</b>, ${message}</p>
                <div style="background:#f9fafb;border-radius:8px;padding:16px;text-align:left;margin-bottom:16px;">
                    <p style="margin:0;color:#111;"><b>Item:</b> ${itemName}</p>
                    ${adminNote ? `<p style="margin:8px 0 0;color:#374151;"><b>Note from team:</b> ${adminNote}</p>` : ''}
                </div>
                <p style="color:#9ca3af;font-size:12px;">Return ID: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">${returnId}</code></p>
            </div>
            <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
                <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 ShopX. All rights reserved.</p>
            </div>
        </div>`
    })
}
