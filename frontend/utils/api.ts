import { syncManager } from "./syncManager";

/**
 * 🌾 Smart Farmer API Service Configuration
 * Use 127.0.0.1 explicitly to avoid Windows IPv6 (::1) localhost resolution conflicts.
 */
const BACKEND_URL = "http://127.0.0.1:8000";

/**
 * Utility to handle caching for GET requests
 */
const getCache = (key: string) => {
  if (typeof window === "undefined") return null;
  const item = localStorage.getItem(`cache_${key}`);
  return item ? JSON.parse(item) : null;
};

const setCache = (key: string, data: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`cache_${key}`, JSON.stringify(data));
};

export const apiService = {
  /**
   * Sends a message to the AI chat backend
   */
  sendChatMessage: async (message: string): Promise<{ response: string }> => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      syncManager.addRequest("/chat", "POST", { message });
      return {
        response:
          "[Offline Mode] Your message has been queued and will be sent once you are back online.",
      };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to get response");
      }

      return await response.json();
    } catch (error) {
      console.error("API Service Error:", error);
      throw error;
    }
  },

  /**
   * Sends a message to the AI voice backend
   */
  sendVoiceMessage: async (message: string): Promise<{ response: string }> => {
    try {
      const response = await fetch(`${BACKEND_URL}/voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Failed to get voice response");
      return await response.json();
    } catch (error) {
      console.error("Voice API Error:", error);
      throw error;
    }
  },

  /**
   * Fetches the farmer profile (with caching)
   */
  getProfile: async () => {
    const cache = getCache("profile");
    try {
      const response = await fetch(`${BACKEND_URL}/profile`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setCache("profile", data);
      return data;
    } catch (error) {
      if (cache) return cache;
      throw error;
    }
  },

  /**
   * Updates the farmer profile
   */
  updateProfile: async (data: {
    age?: number;
    gender?: string;
    location?: string;
    farming_type?: string;
  }) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      syncManager.addRequest("/profile", "POST", data);
      setCache("profile", data); 
      return data;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const result = await response.json();
      setCache("profile", result);
      return result;
    } catch (error) {
      console.error("Profile Update Error:", error);
      throw error;
    }
  },

  /**
   * Fetches all activity history (with caching)
   */
  getHistory: async () => {
    const cache = getCache("history");
    try {
      const response = await fetch(`${BACKEND_URL}/history`);
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setCache("history", data);
      return data;
    } catch (error) {
      if (cache) return cache;
      throw error;
    }
  },

  /**
   * Sends an image to the AI vision backend
   */
  analyzeImage: async (file: File): Promise<{ analysis: string[] }> => {
    try {
      if (!file) throw new Error("Error: No image provided.");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BACKEND_URL}/analyze-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Analysis Link Failure.");
      }

      return await response.json();
    } catch (error) {
      console.error("Vision Analysis Error:", error);
      throw new Error(
        "Unable to establish vision uplink. Check backend availability.",
      );
    }
  },

  /**
   * Fetches market prices and trends (with caching)
   */
  getMarketPrices: async () => {
    const cache = getCache("market_prices");
    try {
      const response = await fetch(`${BACKEND_URL}/market/market-prices`);
      if (!response.ok) throw new Error("Failed to fetch market data");
      const data = await response.json();
      setCache("market_prices", data);
      return data;
    } catch (error) {
      if (cache) return cache;
      throw error;
    }
  },

  /**
   * Fetches real-time weather metadata
   */
  getWeather: async (lat: number, lon: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/weather?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error("Weather service unreachable.");
      return await response.json();
    } catch (error) {
      console.error("Weather API Error:", error);
      throw error;
    }
  },

  /**
   * Fetches AI-driven financial advice for farmers
   */
  getMoneyAdvice: async (data: any) => {
    try {
      const response = await fetch(`${BACKEND_URL}/financial/money-advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Financial advisor service unreachable.");
      return await response.json();
    } catch (error) {
      console.error("Money Advisor API Error:", error);
      throw error;
    }
  },

  /**
   * Fetches eligible government schemes
   */
  getSchemes: async (data: any) => {
    try {
      const response = await fetch(`${BACKEND_URL}/schemes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Schemes service unreachable.");
      return await response.json();
    } catch (error) {
      console.error("Schemes API Error:", error);
      throw error;
    }
  },

  /**
   * Adds a new product to the Farmer Marketplace
   */
  addProduct: async (formData: FormData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/marketplace/add-product`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Marketplace upload failed.");
      return await response.json();
    } catch (error) {
      console.error("Marketplace Add Error:", error);
      throw error;
    }
  },

  /**
   * Fetches all marketplace products with optional filters
   */
  getProducts: async (filters: { category?: string; location?: string } = {}) => {
    try {
      const { category, location } = filters;
      let url = `${BACKEND_URL}/marketplace/products?`;
      if (category) url += `category=${category}&`;
      if (location) url += `location=${location}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Could not fetch marketplace products.");
      return await response.json();
    } catch (error) {
      console.error("Marketplace Fetch Error:", error);
      throw error;
    }
  },

  /**
   * Fetches high-fidelity details for a specific product
   */
  getProduct: async (id: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/marketplace/product/${id}`);
      if (!response.ok) throw new Error("Product entity not found.");
      return await response.json();
    } catch (error) {
      console.error("Product Fetch Error:", error);
      throw error;
    }
  },

  /**
   * Removes a product from the marketplace registry
   */
  deleteProduct: async (id: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/marketplace/product/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Product purge failed.");
      return await response.json();
    } catch (error) {
      console.error("Product Delete Error:", error);
      throw error;
    }
  },
};
