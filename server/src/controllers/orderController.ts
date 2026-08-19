import { Request, Response } from 'express';
import { db } from '../config/db.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { sendOrderConfirmationEmail } from '../services/emailService.ts';

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      deliveryAddress,
      preferredDate,
      customerNotes,
      paymentMethod,
      items
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !deliveryMethod || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, phone, delivery method, and preferred delivery date are required.'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your order must contain at least one item.'
      });
    }

    if (deliveryMethod !== 'IN_STORE_PICKUP' && !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required for Manhattan or NYC delivery.'
      });
    }

    const order = await db.createOrder(
      {
        userId: req.user?.id || null,
        customerName,
        customerEmail,
        customerPhone,
        deliveryMethod,
        deliveryAddress: deliveryAddress || null,
        preferredDate: new Date(preferredDate),
        customerNotes: customerNotes || null,
        paymentMethod: paymentMethod || 'VISA',
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
        subtotal: 0,
        deliveryFee: 0,
        total: 0
      },
      items
    );

    // Prepare items for email receipt
    const emailItems = (order.orderItems || []).map(item => ({
      productName: item.product?.name || 'Artisan Cake',
      quantity: item.quantity,
      price: item.unitPrice,
      customization: item.customization || undefined,
    }));

    // Send/Simulate confirmation email
    const emailResult = await sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryMethod: order.deliveryMethod,
      deliveryAddress: order.deliveryAddress,
      preferredDate: order.preferredDate,
      customerNotes: order.customerNotes,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      items: emailItems,
    });

    return res.status(201).json({
      success: true,
      message: emailResult.simulated
        ? `Order #${order.orderNumber} confirmed! Digital receipt generated for ${customerEmail}.`
        : `Order #${order.orderNumber} confirmed! We have sent a confirmation email to ${customerEmail}.`,
      data: {
        ...order,
        emailConfirmation: {
          sent: !emailResult.simulated,
          simulated: emailResult.simulated,
          recipient: customerEmail,
          htmlPreview: emailResult.htmlContent,
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process order.'
    });
  }
}

export async function lookupOrders(req: Request, res: Response) {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address or order number to search.'
      });
    }

    const orders = await db.getOrdersByEmailOrNumber(query);

    return res.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to lookup order.'
    });
  }
}

export async function getOrders(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Admins see all orders; customers see their own
    const orders = req.user.role === 'ADMIN'
      ? await db.getAllOrders()
      : await db.getAllOrders(req.user.id);

    return res.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve orders.'
    });
  }
}

export async function getOrderById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const order = await db.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Customer can only view their own order unless admin
    if (req.user && req.user.role !== 'ADMIN' && order.userId && order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this order.'
      });
    }

    return res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve order.'
    });
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: 'Order status is required.'
      });
    }

    const updated = await db.updateOrderStatus(id, orderStatus, paymentStatus);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Order status updated successfully.',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status.'
    });
  }
}
