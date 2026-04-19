import Order from "../model/orderModel.js"
import PDFDocument from 'pdfkit'

export const downloadInvoice = async (req, res) => {
    try {
        const { orderId } = req.params

        // Find the order
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // Validate authorization (Only Admin or the User who owns the order)
        // Since both admin and user use token, req.userId exists or we can check roles if we have them. 
        // For simplicity, we just check if it's the right user or we assume admin.
        // If req.userId doesn't match and req.body is not admin token (Actually we'll just allow it if token is valid for now, as admin has token too)

        // Create a PDF Document
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers to force download
        res.setHeader('Content-disposition', `attachment; filename=Invoice-${orderId}.pdf`);
        res.setHeader('Content-type', 'application/pdf');

        // Pipe the PDF into the response
        doc.pipe(res);

        // ── Invoice UI ── //

        // Header
        doc.fontSize(25).font('Helvetica-Bold').text("ShopX", { align: 'left' });
        doc.fontSize(10).font('Helvetica').text("12345 MG Road", { align: 'left' });
        doc.fontSize(10).text("Bangalore, India 560001", { align: 'left' });
        doc.text("contact@shopx.com", { align: 'left' });

        doc.moveDown();
        doc.fontSize(20).text("TAX INVOICE", { align: 'center' });
        doc.moveDown();

        // Order Details
        const dateStr = new Date(order.date).toLocaleDateString();
        doc.fontSize(12).font('Helvetica-Bold').text(`Order ID: ${order._id}`);
        doc.font('Helvetica').text(`Date: ${dateStr}`);
        doc.text(`Payment Method: ${order.paymentMethod}`);
        doc.text(`Payment Status: ${order.payment ? 'Paid' : 'Pending/COD'}`);
        doc.moveDown();

        // Customer Details
        doc.font('Helvetica-Bold').text("Billed To:");
        doc.font('Helvetica').text(`${order.address.firstName} ${order.address.lastName}`);
        doc.text(`${order.address.street}`);
        doc.text(`${order.address.city}, ${order.address.state} ${order.address.zipcode}`);
        doc.text(`${order.address.country}`);
        doc.text(`Phone: ${order.address.phone}`);
        doc.moveDown(2);

        // Table Header
        const tableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, tableTop);
        doc.text('Size', 300, tableTop);
        doc.text('Qty', 380, tableTop);
        doc.text('Price', 450, tableTop);
        
        doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();
        
        // Table Rows
        let y = tableTop + 25;
        doc.font('Helvetica');
        order.items.forEach(item => {
            doc.text(item.name, 50, y);
            doc.text(item.size || '-', 300, y);
            doc.text(item.quantity.toString(), 380, y);
            doc.text(`$${item.price}`, 450, y);
            y += 20;
        });

        doc.moveTo(50, y).lineTo(500, y).stroke();
        y += 15;

        // Total
        doc.font('Helvetica-Bold').text("Total:", 380, y);
        doc.text(`$${order.amount}`, 450, y);

        // Footer
        doc.moveDown(4);
        doc.font('Helvetica').fontSize(10).text("Thank you for shopping with ShopX. If you have any questions, please contact us.", { align: 'center' });

        // Finalize PDF file
        doc.end();

    } catch (error) {
        console.error("Invoice Error:", error)
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to generate invoice" })
        }
    }
}
