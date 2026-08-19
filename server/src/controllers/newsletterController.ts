import { Request, Response } from 'express';
import { db } from '../config/db.ts';

export async function subscribeNewsletter(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.'
      });
    }

    const subscriber = await db.addNewsletterSubscriber(email);

    return res.status(201).json({
      success: true,
      message: 'Welcome to The Velvet Circle! You will receive our seasonal flavor releases and exclusive pastry invitations.',
      data: subscriber
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to subscribe to newsletter.'
    });
  }
}

export async function getNewsletterSubscribers(req: Request, res: Response) {
  try {
    const subscribers = await db.getNewsletterSubscribers();
    return res.json({
      success: true,
      data: subscribers
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve newsletter subscribers.'
    });
  }
}
