import { GoogleGenAI } from "@google/genai";
import type { TripPlan, GroundingAttribution } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we will proceed, but API calls will fail without a key.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateTripPlan = async (origin: string, destination: string, budget: number): Promise<TripPlan[]> => {
  const prompt = `
    You are an expert travel agent AI. Your task is to generate a comprehensive, realistic, and bookable 5-day travel itinerary from ${origin} to ${destination}. The user has provided a target budget of $${Math.round(budget)} USD.

    CRITICAL INSTRUCTION: You MUST use Google Search to find real-time, accurate information for flights, hotels, activities, and restaurants. All generated information, especially business names, prices, and booking links, MUST be from the real-time search results. Do not invent or hallucinate any details. Verify business names exist at the destination.

    Generate THREE distinct trip plans in a JSON array, categorized as "Budget", "Moderate", and "Luxury". Your cost targets are guidelines. It is more important to return a complete, valid plan than to strictly adhere to the budget percentages. If you cannot meet the exact budget ranges, get as close as you can and still provide a full itinerary.

    1.  **Budget Plan**: Aim for a 'totalCost' between 85% and 95% of the user's budget of $${Math.round(budget)}.
    2.  **Moderate Plan**: Aim for a 'totalCost' between 95% and 100% of the user's budget of $${Math.round(budget)}.
    3.  **Luxury Plan**: Aim for a 'totalCost' between 110% and 125% of the user's budget of $${Math.round(budget)}.


    For EACH of the three plans, you must generate the following:
    1.  A 'planName' that is exactly "Budget Plan", "Moderate Plan", or "Luxury Plan" respectively.
    2.  The 'destination'.
    3.  A total estimated 'totalCost' in USD.
    4.  A 'budgetBreakdown' as percentages for Flights, Hotels, Activities, and Food. The sum must be 100.
    5.  A short, enticing 'summary' for the trip package.
    6.  A list of 1-2 recommended 'flights' in an array, each as an object including airline, price, bookingLink, and a short description. Provide varied options (e.g., budget, standard).
    7.  A list of 1-2 recommended 'hotels' in an array for a 5-night stay, each as an object including name, price, rating (1-5), bookingLink, and description. Provide varied options (e.g., budget, mid-range). DO NOT provide a photoUrl.
    8.  A list of 3-5 recommended 'activities', each with a name, description, price, and bookingLink. For activities that are free or open to the public (e.g., parks, walking tours), set the 'price' to 0. The 'bookingLink' for free activities can be a link to an official information page. DO NOT provide a photoUrl.
    9.  A list of 3-5 recommended 'restaurants', each with a name, cuisine, an 'averagePrice' (number, estimated cost for a meal for one person in USD), a 'bookingLink', and a list of 2-3 'menuSuggestions' (strings, e.g., "Margherita Pizza", "Spaghetti Carbonara"). DO NOT provide a photoUrl.
    10. For every item (flight, hotel, activity, restaurant), provide a real link. For paid items, it must be a booking link. For free items, it can be an informational link.

    You must respond ONLY with a single JSON object with a single key "tripPlans", which contains the array of the three plan objects. Do not include any introductory text, explanations, code block formatting (like \`\`\`json), or markdown. The JSON should be directly parsable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    let jsonString = response.text.trim();
    
    // The model can sometimes wrap the JSON in markdown ```json ... ```.
    const markdownMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
        jsonString = markdownMatch[1].trim();
    }

    // The model might still return some text before the JSON object.
    const jsonStart = jsonString.indexOf('{');
    if (jsonStart === -1) {
      console.error("Invalid response from AI: No JSON object found.", response.text);
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
    
    // Find the corresponding closing brace for the initial opening brace.
    let braceCount = 0;
    let jsonEnd = -1;
    for (let i = jsonStart; i < jsonString.length; i++) {
        if (jsonString[i] === '{') {
            braceCount++;
        } else if (jsonString[i] === '}') {
            braceCount--;
        }
        if (braceCount === 0) {
            jsonEnd = i;
            break;
        }
    }
    
    if (jsonEnd === -1) {
        console.error("Invalid response from AI: Incomplete JSON object.", response.text);
        throw new Error("The AI returned an invalid response format. Please try again.");
    }

    const finalJsonString = jsonString.substring(jsonStart, jsonEnd + 1);
    
    const parsedJson = JSON.parse(finalJsonString);
    const plans: Omit<TripPlan, 'groundingAttributions' | 'destination'>[] = parsedJson.tripPlans;

    if (!plans || !Array.isArray(plans) || plans.length === 0) {
        console.error("Parsed JSON from AI did not contain valid trip plans. Full AI response text:", response.text);
        throw new Error("The AI did not generate any trip plans. Please try again.");
    }

    const attributions: GroundingAttribution[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web)
        .filter((web): web is { uri: string; title: string } => !!web?.uri && !!web.title)
        .reduce((acc, current) => { 
            if (!acc.find(item => item.uri === current.uri)) {
                acc.push(current);
            }
            return acc;
        }, [] as GroundingAttribution[]) || [];

    const finalPlans: TripPlan[] = plans.map(plan => ({
      ...plan,
      destination: destination,
      groundingAttributions: attributions, // Attach all sources to each plan
    }));

    // Ensure plans are sorted correctly: Budget, Moderate, Luxury
    finalPlans.sort((a, b) => {
        const order = ["Budget Plan", "Moderate Plan", "Luxury Plan"];
        return order.indexOf(a.planName) - order.indexOf(b.planName);
    });


    return finalPlans;
  } catch (error) {
    console.error("Error generating trip plan:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the trip plan from the AI. Please try again.");
    }
    throw new Error("Failed to generate trip plan. The AI may be experiencing high demand. Please try again later.");
  }
};