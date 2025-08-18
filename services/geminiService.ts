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
    You are an expert travel agent AI. Your task is to generate a comprehensive, realistic, and bookable 5-day travel itinerary from ${origin} to ${destination} with a target budget around $${Math.round(budget)} USD.

    CRITICAL INSTRUCTION: You MUST use Google Search to find real-time, accurate information for flights, hotels, activities, and restaurants. All generated information, especially business names, prices, and booking links, MUST be from the real-time search results. Do not invent or hallucinate any details. Verify business names exist at the destination.

    Generate THREE distinct and complete trip plans in a JSON array. Each plan should cater to a different travel style but remain close to the user's budget. For example:
    1.  'The Savvy Explorer': Focuses on the best value and budget-friendly options.
    2.  'The Classic Journey': A balanced plan with popular sights and comfortable stays.
    3.  'The Indulgent Escape': Features premium experiences, luxury hotels, or unique activities.

    For EACH of the three plans, you must generate the following:
    1.  A unique 'planName' (e.g., "The Savvy Explorer").
    2.  The 'destination'.
    3.  A total estimated 'totalCost' in USD.
    4.  A 'budgetBreakdown' as percentages for Flights, Hotels, Activities, and Food. The sum must be 100.
    5.  A short, enticing 'summary' for the trip package.
    6.  A single recommended 'flight' object, including airline, price, bookingLink, and a short description.
    7.  A single recommended 'hotel' object for a 5-night stay, including name, price, rating (1-5), bookingLink, and description. DO NOT provide a photoUrl.
    8.  A list of 3-5 recommended 'activities', each with a name, description, price, and bookingLink. DO NOT provide a photoUrl.
    9.  A list of 3-5 recommended 'restaurants', each with a name, cuisine, priceRange (e.g., $, $$, $$$), and bookingLink. DO NOT provide a photoUrl.
    10. For every item (flight, hotel, activity, restaurant), provide a real booking link.

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

    const jsonText = response.text.trim();
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Invalid response from AI:", jsonText);
      throw new Error("The AI returned an invalid response format. Please try again.");
    }
    
    const parsedJson = JSON.parse(jsonMatch[0]);
    const plans: Omit<TripPlan, 'groundingAttributions' | 'destination'>[] = parsedJson.tripPlans;

    if (!plans || !Array.isArray(plans) || plans.length === 0) {
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

    return finalPlans;
  } catch (error) {
    console.error("Error generating trip plan:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the trip plan from the AI. Please try again.");
    }
    throw new Error("Failed to generate trip plan. The AI may be experiencing high demand. Please try again later.");
  }
};