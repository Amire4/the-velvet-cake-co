import { Request, Response } from 'express';
import { db } from '../config/db.ts';

export async function submitContactMessage(req: Request, res: Response) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required fields.'
      });
    }

    const newMessage = await db.createContactMessage({
      name,
      email,
      phone: phone || null,
      subject,
      message
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your message! Our concierge team will respond within 24 hours.',
      data: newMessage
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit contact message.'
    });
  }
}

export async function getContactMessages(req: Request, res: Response) {
  try {
    const messages = await db.getAllContactMessages();
    return res.json({
      success: true,
      data: messages
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve messages.'
    });
  }
}

export async function updateContactStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.'
      });
    }

    const updated = await db.updateContactStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Message status updated.',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update message status.'
    });
  }
}
