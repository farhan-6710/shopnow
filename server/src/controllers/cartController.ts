import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * @desc    Get all cart items for authenticated user
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const transformedItems = cartItems.map((item) => ({
      ...item.product,
      id: Number(item.product.id), // Ensure serialization
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: transformedItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
};

/**
 * @desc    Add item(s) to cart
 * @route   POST /api/cart
 * @access  Private
 */
export const addToCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const items = Array.isArray(req.body)
      ? req.body
      : [{ productId: req.body.productId, quantity: req.body.quantity || 1 }];

    if (items.length === 0) {
      res.status(400).json({ success: false, error: 'No items provided' });
      return;
    }

    // Process each item
    for (const item of items) {
      const { productId, quantity = 1 } = item;
      if (!productId) continue;

      // Handle BigInt conversion safely when receiving from Request Body
      const productIdBigInt = BigInt(productId);

      await prisma.cartItem.upsert({
        where: {
          userId_productId: {
            userId,
            productId: productIdBigInt,
          },
        },
        update: {
          quantity: quantity,
        },
        create: {
          userId,
          productId: productIdBigInt,
          quantity,
        },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to add item to cart' });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart
 * @access  Private
 */
export const updateCartItem = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      res
        .status(400)
        .json({
          success: false,
          error: 'Product ID and quantity are required',
        });
      return;
    }

    if (quantity < 1) {
      res
        .status(400)
        .json({ success: false, error: 'Quantity must be at least 1' });
      return;
    }

    await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId: BigInt(productId),
        },
      },
      data: {
        quantity,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to update cart item' });
  }
};

/**
 * @desc    Remove single item, bulk items, or clear all cart items
 * @route   DELETE /api/cart
 * @access  Private
 */
export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { productId, productIds } = req.body;

    // Bulk delete
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      const bigIntIds = productIds.map((id) => BigInt(id));
      await prisma.cartItem.deleteMany({
        where: {
          userId,
          productId: {
            in: bigIntIds,
          },
        },
      });
      res.status(200).json({ success: true });
      return;
    }

    // Clear all
    if (!productId) {
      await prisma.cartItem.deleteMany({
        where: { userId },
      });
      res.status(200).json({ success: true });
      return;
    }

    // Single item delete
    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId: BigInt(productId),
        },
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to remove item from cart' });
  }
};
