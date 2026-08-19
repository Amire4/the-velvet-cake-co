import { Request, Response } from 'express';
import { db } from '../config/db.ts';

export async function getFlavors(req: Request, res: Response) {
  try {
    const { available } = req.query;
    const flavors = await db.getAllFlavors(available === 'true');

    return res.json({
      success: true,
      data: flavors
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve cake flavors.'
    });
  }
}

export async function createFlavor(req: Request, res: Response) {
  try {
    const { name, description, available } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Flavor name and description are required.'
      });
    }

    const flavor = await db.createFlavor({
      name,
      description,
      available: available !== undefined ? Boolean(available) : true
    });

    return res.status(201).json({
      success: true,
      message: 'Cake flavor added successfully.',
      data: flavor
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create cake flavor.'
    });
  }
}

export async function updateFlavor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, available } = req.body;

    const updated = await db.updateFlavor(id, {
      name,
      description,
      available: available !== undefined ? Boolean(available) : undefined
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Cake flavor not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Cake flavor updated successfully.',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update cake flavor.'
    });
  }
}

export async function deleteFlavor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await db.deleteFlavor(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Cake flavor not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Cake flavor deleted successfully.'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete cake flavor.'
    });
  }
}
