// src/constants/api.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5001";

export const REQUEST_TYPE = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export const API_URL = {
  // Products
  PRODUCTS: {
    url: BASE_URL + "/products",
    type: REQUEST_TYPE.GET,
  },
  // Cart
  CART: {
    url: BASE_URL + "/cart",
  },
  // Wishlist
  WISHLIST: {
    url: BASE_URL + "/wishlist",
  },
  // Feedback
  FEEDBACK: {
    url: BASE_URL + "/feedback",
    type: REQUEST_TYPE.POST,
  },
  // Auth
  AUTH: {
    SIGNUP: {
      url: BASE_URL + "/auth/signup",
      type: REQUEST_TYPE.POST,
    },
    LOGIN: {
      url: BASE_URL + "/auth/login",
      type: REQUEST_TYPE.POST,
    },
    LOGOUT: {
      url: BASE_URL + "/auth/logout",
      type: REQUEST_TYPE.POST,
    },
    ME: {
      url: BASE_URL + "/auth/me",
      type: REQUEST_TYPE.GET,
    },
    GOOGLE_INIT: {
      url: BASE_URL + "/auth/google",
      type: REQUEST_TYPE.GET,
    },
  },
} as const;
