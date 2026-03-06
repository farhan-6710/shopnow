// src/services/cartApi.ts
import { CartItem } from "@/types/cartItems";
import { ApiResponse, BulkCartItemPayload, CartItemPayload } from "@/types/api";
import { API_URL } from "@/constants/api";
import { axiosInstance } from "./axiosInstance";

/**
 * Cart API Service
 * Centralized API layer for all cart-related operations
 */
export const cartApi = {
  /**
   * Fetch all cart items for the authenticated user
   */
  async fetch(): Promise<CartItem[]> {
    const response = await axiosInstance.get<ApiResponse<CartItem[]>>(
      API_URL.CART.url,
    );
    const data = response.data;
    if (!data.success) throw new Error(data.error || "Failed to fetch cart");
    return data.data!;
  },

  /**
   * Add a single item to cart
   */
  async addItem(productId: number, quantity: number = 1): Promise<void> {
    const payload: CartItemPayload = { productId, quantity };
    const response = await axiosInstance.post<ApiResponse>(
      API_URL.CART.url,
      payload,
    );
    const data = response.data;
    if (!data.success) throw new Error(data.error || "Failed to add to cart");
  },

  /**
   * Add multiple items to cart (for sync)
   */
  async addBulkItems(items: BulkCartItemPayload[]): Promise<void> {
    const response = await axiosInstance.post<ApiResponse>(
      API_URL.CART.url,
      items,
    );
    const data = response.data;
    if (!data.success) throw new Error(data.error || "Failed to sync cart");
  },

  /**
   * Update item quantity
   */
  async updateQuantity(productId: number, quantity: number): Promise<void> {
    const payload: CartItemPayload = { productId, quantity };
    const response = await axiosInstance.put<ApiResponse>(
      API_URL.CART.url,
      payload,
    );
    const data = response.data;
    if (!data.success)
      throw new Error(data.error || "Failed to update quantity");
  },

  /**
   * Remove a single item from cart
   */
  async removeItem(productId: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(API_URL.CART.url, {
      data: { productId },
    });
    const data = response.data;
    if (!data.success)
      throw new Error(data.error || "Failed to remove from cart");
  },

  /**
   * Remove multiple items from cart (for sync)
   */
  async removeBulkItems(productIds: number[]): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(API_URL.CART.url, {
      data: { productIds },
    });
    const data = response.data;
    if (!data.success)
      throw new Error(data.error || "Failed to bulk remove items");
  },

  /**
   * Clear all cart items
   */
  async clearAll(): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(API_URL.CART.url);
    const data = response.data;
    if (!data.success) throw new Error(data.error || "Failed to clear cart");
  },
};
