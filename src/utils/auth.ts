// src/utils/auth.ts
import { authApi } from "@/services/authApi";

let memoryAuthStatus: boolean | null = null;
let pendingCheck: Promise<boolean> | null = null;

export const setMemoryAuthStatus = (status: boolean | null) => {
  memoryAuthStatus = status;
};

/**
 * Check if the current user is authenticated
 * @returns Promise<boolean> - true if user has an active session
 */
export const isAuthenticated = async (): Promise<boolean> => {
  if (memoryAuthStatus !== null) {
    return memoryAuthStatus;
  }

  if (pendingCheck) return pendingCheck;

  pendingCheck = (async () => {
    try {
      const data = await authApi.me();
      memoryAuthStatus = data.status === "success";
      return memoryAuthStatus;
    } catch {
      memoryAuthStatus = false;
      return false;
    } finally {
      pendingCheck = null;
    }
  })();

  return pendingCheck;
};
