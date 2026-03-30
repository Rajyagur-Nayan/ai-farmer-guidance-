import httpx
from typing import Optional, Dict

class LocationService:
    @staticmethod
    async def reverse_geocode(lat: float, lon: float) -> Dict[str, str]:
        """
        Converts coordinates to state and district using Nominatim (OpenStreetMap).
        """
        # Nominatim requires a descriptive User-Agent
        headers = {
            "User-Agent": "SmartFarmerAI/1.0 (contact@smartfarmerai.com)"
        }
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=10&addressdetails=1"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, timeout=10.0)
                
            if response.status_code != 200:
                return {"state": "Unknown", "district": "Unknown", "status": "Offline"}
            
            data = response.json()
            address = data.get("address", {})
            
            return {
                "state": address.get("state") or address.get("province") or "Unknown",
                "district": address.get("district") or address.get("county") or address.get("city") or "Unknown",
                "status": "Success"
            }
        except Exception as e:
            print(f"Location Service Error: {e}")
            return {"state": "Unknown", "district": "Unknown", "status": "Error"}
