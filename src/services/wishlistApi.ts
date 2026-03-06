// src/services/wishlistApi.ts
import { Product } from "@/types/product";
import { ApiResponse, WishlistItemPayload } from "@/types/api";
import { API_URL } from "@/constants/api";
import { axiosInstance } from "./axiosInstance";
import axios from "axios";

/**
 * Wishlist API Service
 * Centralized API layer for all wishlist-related operations
 */
export const wishlistApi = {
  /**
   * Fetch all wishlist items for the authenticated user
   */
  async fetch(): Promise<Product[]> {
    const response = await axiosInstance.get<ApiResponse<Product[]>>(
      API_URL.WISHLIST.url,
    );
    const data = response.data;
    if (!data.success)
      throw new Error(data.error || "Failed to fetch wishlist");
    return data.data!;
  },

  /**
   * Add a single item to wishlist
   */
  async addItem(productId: number): Promise<void> {
    const payload: WishlistItemPayload = { productId };
    try {
      const response = await axiosInstance.post<ApiResponse>(
        API_URL.WISHLIST.url,
        payload,
      );
      const data = response.data;
      if (!data.success) {
        throw new Error(data.error || "Failed to add to wishlist");
      }
    } catch (error: unknown) {
      // 409 = already exists, which is fine
      if (axios.isAxiosError(error) && error.response?.status !== 409) {
        throw new Error(
          error.response?.data?.error || "Failed to add to wishlist",
        );
      }
    }
  },

  /**
   * Add multiple items to wishlist (for sync)
   */
  async addBulkItems(productIds: number[]): Promise<void> {
    const payload: WishlistItemPayload[] = productIds.map((id) => ({
      productId: id,
    }));
    const response = await axiosInstance.post<ApiResponse>(
      API_URL.WISHLIST.url,
      payload,
    );
    const data = response.data;
    if (!data.success) throw new Error(data.error || "Failed to sync wishlist");
  },

  /**
   * Remove a single item from wishlist
   */
  async removeItem(productId: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_URL.WISHLIST.url,
      {
        data: { productId },
      },
    );
    const data = response.data;
    if (!data.success)
      throw new Error(data.error || "Failed to remove from wishlist");
  },

  /**
   * Remove multiple items from wishlist (for sync)
   */
  async removeBulkItems(productIds: number[]): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_URL.WISHLIST.url,
      {
        data: { productIds },
      },
    );
    const data = response.data;
    if (!data.success)
      throw new Error(data.error || "Failed to bulk remove items");
  },

  /**
   * Clear all wishlist items
   */
  async clearAll(): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_URL.WISHLIST.url,
    );
    const data = response.data;
    if (!data.success)
      throw new Error(data.error || "Failed to clear wishlist");
  },
};
