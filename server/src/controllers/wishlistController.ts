import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * @desc    Get all wishlist items for authenticated user
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const transformedItems = wishlistItems.map((item) => ({
      ...item.product,
      id: Number(item.product.id), // Ensure serialization
    }));

    res.status(200).json({ success: true, data: transformedItems });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch wishlist' });
  }
};

/**
 * @desc    Add item(s) to wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
export const addToWishlist = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const body = req.body;
    const productIds = Array.isArray(body)
      ? body.map((item) => item.productId)
      : [body.productId];

    if (productIds.length === 0 || !productIds[0]) {
      res
        .status(400)
        .json({ success: false, error: 'No product IDs provided' });
      return;
    }

    const bigIntProductIds = productIds.map((id) => BigInt(id));

    // Get existing to avoid duplicates
    const existingItems = await prisma.wishlistItem.findMany({
      where: {
        userId,
        productId: {
          in: bigIntProductIds,
        },
      },
      select: { productId: true },
    });

    const existingIds = new Set(
      existingItems.map((item) => Number(item.productId)),
    );
    const newProductIds = productIds.filter(
      (id) => !existingIds.has(Number(id)),
    );

    if (newProductIds.length > 0) {
      const itemsToInsert = newProductIds.map((productId) => ({
        userId,
        productId: BigInt(productId),
      }));

      await prisma.wishlistItem.createMany({
        data: itemsToInsert,
      });
    }

    res.status(200).json({
      success: true,
      added: newProductIds.length,
      skipped: existingIds.size,
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to add item to wishlist' });
  }
};

/**
 * @desc    Remove single item, bulk items, or clear all wishlist items
 * @route   DELETE /api/wishlist
 * @access  Private
 */
export const removeFromWishlist = async (
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
      await prisma.wishlistItem.deleteMany({
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
      await prisma.wishlistItem.deleteMany({
        where: { userId },
      });
      res.status(200).json({ success: true });
      return;
    }

    // Single item delete
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId: BigInt(productId),
        },
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to remove item from wishlist' });
  }
};
