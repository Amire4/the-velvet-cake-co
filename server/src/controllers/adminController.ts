import { Request, Response } from 'express';
import { db } from '../config/db.ts';

export async function getAdminOverview(req: Request, res: Response) {
  try {
    const stats = await db.getAdminStats();
    return res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve admin statistics.'
    });
  }
}

export async function getCustomers(req: Request, res: Response) {
  try {
    const allUsers = await db.getAllUsers();
    const customers = allUsers.filter(u => u.role === 'CUSTOMER').map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      createdAt: u.createdAt
    }));

    return res.json({
      success: true,
      data: customers
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve customer list.'
    });
  }
}
