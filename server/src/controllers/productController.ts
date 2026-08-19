import { Request, Response } from 'express';
import { db } from '../config/db.ts';

export async function getProducts(req: Request, res: Response) {
  try {
    const { category, featured, available } = req.query;
    const products = await db.getAllProducts({
      category: typeof category === 'string' ? category : undefined,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      availableOnly: available === 'true'
    });

    return res.json({
      success: true,
      data: products
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve products.'
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await db.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve product details.'
    });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, category, price, imageUrl, featured, available } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, and price are required fields.'
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await db.createProduct({
      name,
      slug,
      description,
      category,
      price: parseFloat(price),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
      featured: Boolean(featured),
      available: available !== undefined ? Boolean(available) : true
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product.'
    });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, category, price, imageUrl, featured, available } = req.body;

    const updated = await db.updateProduct(id, {
      name,
      description,
      category,
      price: price !== undefined ? parseFloat(price) : undefined,
      imageUrl,
      featured: featured !== undefined ? Boolean(featured) : undefined,
      available: available !== undefined ? Boolean(available) : undefined
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      data: updated
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product.'
    });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await db.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Product removed successfully.'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product.'
    });
  }
}
