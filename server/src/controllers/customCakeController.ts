import { Response } from 'express';
import { db } from '../config/db.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';

export async function createCustomCakeRequest(req: AuthRequest, res: Response) {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      cakeType,
      size,
      shape,
      tiers,
      flavor,
      filling,
      frosting,
      colors,
      theme,
      message,
      dietaryRequirement,
      eventDate,
      referenceImageUrl,
      additionalNotes
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !cakeType || !flavor || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, cake type, flavor, and event date are required fields.'
      });
    }

    const request = await db.createCustomCakeRequest({
      userId: req.user?.id || null,
      customerName,
      customerEmail,
      customerPhone,
      cakeType,
      size: size || '8-inch (14-18 servings)',
      shape: shape || 'Round',
      tiers: tiers ? parseInt(tiers, 10) : 1,
      flavor,
      filling: filling || 'Vanilla Bean Pastry Cream',
      frosting: frosting || 'Swiss Meringue Buttercream',
      colors: colors || 'Ivory & Gold',
      theme: theme || null,
      message: message || null,
      dietaryRequirement: dietaryRequirement || 'Standard',
      eventDate: new Date(eventDate),
      referenceImageUrl: referenceImageUrl || null,
      additionalNotes: additionalNotes || null
    });

    return res.status(201).json({
      success: true,
      message: 'Your custom cake request has been submitted! Our master pastry team will review your specifications and reach out within 24 hours.',
      data: request
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit custom cake request.'
    });
  }
}

export async function getCustomCakeRequests(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const requests = req.user.role === 'ADMIN'
      ? await db.getAllCustomCakeRequests()
      : await db.getAllCustomCakeRequests(req.user.id);

    return res.json({
      success: true,
      data: requests
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve custom cake requests.'
    });
  }
}

export async function getCustomCakeRequestById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const request = await db.getCustomCakeRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom cake request not found.'
      });
    }

    if (req.user && req.user.role !== 'ADMIN' && request.userId && request.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    return res.json({
      success: true,
      data: request
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve custom cake request.'
    });
  }
}

export async function updateCustomCakeStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, quotedPrice } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.'
      });
    }

    const updated = await db.updateCustomCakeStatus(
      id,
      status,
      quotedPrice !== undefined ? parseFloat(quotedPrice) : undefined
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Custom cake request not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Custom cake request updated successfully.',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update custom cake request.'
    });
  }
}
