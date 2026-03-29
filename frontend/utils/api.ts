import { syncManager } from "./syncManager";

/**
 * 🏥 Clinical API Service Configuration
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
   * Fetches nearby hospitals based on symptoms and location
   */
  getSmartHospitals: async (text: string, lat: number, lng: number, category: string = "All") => {
    try {
      const response = await fetch(`${BACKEND_URL}/smart-hospitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lat, lng, category }),
      });

      if (!response.ok) throw new Error("Failed to fetch nearby hospitals");
      return await response.json();
    } catch (error) {
      console.error("Hospital Finder Error:", error);
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
   * Fetches the user health profile (with caching)
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
   * Updates the user health profile
   */
  updateProfile: async (data: any) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      syncManager.addRequest("/profile", "POST", data);
      setCache("profile", data); // Optimistic cache update
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
   * Fetches all medical history (with caching)
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
   * Fetches AI-based medication advice
   */
  getMedicationAdvice: async (
    message: string,
  ): Promise<{ response: string }> => {
    try {
      const response = await fetch(`${BACKEND_URL}/medication-advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Failed to get medication advice");
      return await response.json();
    } catch (error) {
      console.error("Medication API Error:", error);
      throw error;
    }
  },

  /**
   * Sends an image to the AI vision backend
   */
  analyzeImage: async (file: File): Promise<{ analysis: string[] }> => {
    try {
      if (!file) throw new Error("Protocol Error: No sequence provided.");

      const formData = new FormData();
      formData.append("file", file);

      // Note: We DO NOT set 'Content-Type' header here.
      // The browser must automatically set it to 'multipart/form-data' with the correct boundary.
      const response = await fetch(`${BACKEND_URL}/analyze-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Vision Link Failure.");
      }

      return await response.json();
    } catch (error) {
      console.error("Vision Analysis Error:", error);
      // Propagate a user-friendly error
      throw new Error(
        "Unable to establish vision uplink. Check backend availability.",
      );
    }
  },

  /**
   * Fetches the active consultation queue (with caching)
   */
  getQueue: async () => {
    const cache = getCache("doctor_queue");
    try {
      const response = await fetch(`${BACKEND_URL}/consultations/queue`);
      if (!response.ok) throw new Error("Failed to fetch patient queue");
      const data = await response.json();
      setCache("doctor_queue", data);
      return data;
    } catch (error) {
      if (cache) return cache;
      throw error;
    }
  },

  /**
   * Marks a consultation as Active
   */
  startConsultation: async (id: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/consultations/${id}/start`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to start session");
      return await response.json();
    } catch (error) {
      console.error("Consultation Start Error:", error);
      throw error;
    }
  },

  /**
   * Issues a digital prescription
   */
  issuePrescription: async (data: {
    consultation_id: number;
    medication_details: string;
  }) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      syncManager.addRequest("/prescriptions", "POST", data);
      return { status: "Queued" };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to issue prescription");
      return await response.json();
    } catch (error) {
      console.error("Prescription Issuance Error:", error);
      throw error;
    }
  },

  /**
   * Fetches total doctor earnings (with caching)
   */
  getEarnings: async () => {
    const cache = getCache("doctor_earnings");
    try {
      const response = await fetch(`${BACKEND_URL}/doctor/earnings`);
      if (!response.ok) throw new Error("Failed to fetch earnings");
      const data = await response.json();
      setCache("doctor_earnings", data);
      return data;
    } catch (error) {
      if (cache) return cache;
      throw error;
    }
  },
  /**
   * Books a medical appointment
   */
  bookAppointment: async (data: {
    patient_name: string;
    hospital_name: string;
    specialty?: string;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
  }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to book appointment");
      return await response.json();
    } catch (error) {
      console.error("Booking Error:", error);
      throw error;
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
