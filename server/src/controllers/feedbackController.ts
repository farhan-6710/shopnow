import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * @desc    Submit feedback
 * @route   POST /api/feedback
 * @access  Private
 */
export const submitFeedback = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { topic, rating, message } = req.body;

    if (!topic || !rating || !message) {
      res
        .status(400)
        .json({ success: false, error: 'Missing required fields' });
      return;
    }

    // Convert string ratings to integer to match NextJS equivalent logic
    // Using string indexing to prevent hardcoded type assumptions if rating differs
    const ratingMap: Record<string, number> = {
      excellent: 5,
      good: 4,
      average: 3,
      poor: 2,
      'very-poor': 1,
    };

    const numericRating =
      typeof rating === 'string' ? ratingMap[rating] : rating;
    const finalRating = numericRating || 3; // Default to 3 if mapping fails or not provided

    await prisma.feedback.create({
      data: {
        userId,
        topic,
        rating: finalRating,
        message,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to submit feedback' });
  }
};
