from typing import List, Dict

class CropRecommendationService:
    @staticmethod
    def get_recommendations(state: str, weather_condition: str) -> Dict[str, any]:
        """
        Rule-based crop recommendations based on state and weather.
        """
        state_lc = state.lower()
        weather_lc = weather_condition.lower()
        
        # Default recommendations
        recommended = ["Rice", "Wheat", "Maize"]
        reason = "Climate-resilient varieties with stable market demand."
        
        # State-specific rules
        if "gujarat" in state_lc:
            if "hot" in weather_lc or "clear" in weather_lc:
                recommended = ["Groundnut", "Cotton", "Castor"]
                reason = "Suitable for Gujarat's semi-arid soil and high temperature tolerance."
            else:
                recommended = ["Cumin", "Cotton", "Wheat"]
                reason = "Optimal for current moisture levels in Western India."
        
        elif "punjab" in state_lc or "haryana" in state_lc:
            recommended = ["Wheat", "Rice", "Mustard"]
            reason = "Aligned with high fertilization and irrigation availability in the region."
            
        elif "maharashtra" in state_lc:
            recommended = ["Sugarcane", "Soybean", "Onion"]
            reason = "Matching black soil profile and seasonal precipitation."
            
        elif "kerela" in state_lc or "tamil" in state_lc or "karnataka" in state_lc:
            recommended = ["Coconut", "Rubber", "Coffee", "Rice"]
            reason = "Tropical climate and high humidity support these plantation crops."

        # Weather-based overrides
        if "rain" in weather_lc or "cloudy" in weather_lc:
             if "Rice" not in recommended:
                 recommended.insert(0, "Rice")
                 reason = "Increased precipitation favors water-intensive crops like Rice."

        return {
            "recommended_crops": recommended,
            "region": state,
            "reason": reason
        }
