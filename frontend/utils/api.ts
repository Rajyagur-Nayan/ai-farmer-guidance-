import { syncManager } from "./syncManager";

export interface MarketData {
  crop: string;
  mandi_price: string;
  mandi_name: string;
  trend: "up" | "down" | "steady";
  global_price: string;
  advice: string;
  history: Array<{ date: string; price: number }>;
  category?: string;
}

export interface MarketResponse {
  categories: {
    [key: string]: MarketData[];
  };
}

/**
 * 🌾 Smart Farmer API Service Configuration
 * Production: https://ai-farmer-guidance.onrender.com
 * Local: http://127.0.0.1:8000
 */
const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://ai-farmer-guidance.onrender.com"
    : "http://localhost:8000";

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
  sendChatMessage: async (
    message: string,
    lat?: number,
    lon?: number,
  ): Promise<{ response: string }> => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      syncManager.addRequest("/chat", "POST", { message, lat, lon });
      return {
        response:
          "[Offline Mode] Your message has been queued and will be sent once you are back online.",
      };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, lat, lon }),
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
  sendVoiceMessage: async (
    message: string,
    lat?: number,
    lon?: number,
  ): Promise<{ response: string }> => {
    try {
      const response = await fetch(`${BACKEND_URL}/voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, lat, lon }),
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
  getMarketPrices: async (
    crop?: string,
    lat?: number,
    lon?: number,
  ): Promise<MarketResponse> => {
    const cacheKey = crop ? `market_prices_${crop}` : "market_prices";
    const cache = getCache(cacheKey);

    try {
      let url = `${BACKEND_URL}/market/market-prices`;
      const params = new URLSearchParams();
      if (crop) params.append("crop", crop);
      if (lat) params.append("lat", lat.toString());
      if (lon) params.append("lon", lon.toString());

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch market data");
      const data = await response.json();
      setCache(cacheKey, data);
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
      const response = await fetch(
        `${BACKEND_URL}/weather?lat=${lat}&lon=${lon}`,
      );
      if (!response.ok) throw new Error("Weather service unreachable.");
      return await response.json();
    } catch (error) {
      console.error("Weather API Error:", error);
      throw error;
    }
  },

  /**
   * Fetches real-time UV index metadata
   */
  getUVIndex: async (lat: number, lon: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/uv?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error("UV service offline.");
      return await response.json();
    } catch (error) {
      console.error("UV API Error:", error);
      throw error;
    }
  },

  /**
   * Fetches real-time soil moisture telemetry
   */
  getSoilMoisture: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/soil`);
      if (!response.ok) throw new Error("IoT hardware link Failure.");
      return await response.json();
    } catch (error) {
      console.error("Soil API Error:", error);
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
      if (!response.ok)
        throw new Error("Financial advisor service unreachable.");
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
  getProducts: async (
    filters: { category?: string; location?: string } = {},
  ) => {
    try {
      const { category, location } = filters;
      let url = `${BACKEND_URL}/marketplace/products?`;
      if (category) url += `category=${category}&`;
      if (location) url += `location=${location}`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Could not fetch marketplace products.");
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
