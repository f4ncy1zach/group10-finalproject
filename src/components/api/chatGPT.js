/**
 * Gets an AI-recommended destination based on traveler information
 *
 * @param {Object} body - The traveler information and trip details
 * @param {number} body["No. of travelers"] - Number of travelers
 * @param {Array} body["Traveler(s) information"] - Array of traveler objects with passport and visa info
 * @param {Date} body["Departure Date"] - When the user wants to leave
 * @param {Date} body["Return Date"] - When the user wants to return
 * @returns {Promise<Object>} Object containing location and state recommendations
 */
export async function getDestination(body) {
    const prompt = `
        Based on these following criterias and current situations give the best possible place to travel to.
        Here are the criterias:
        ${JSON.stringify(body)}

        REQUIREMENTS:
        - ONLY return the result in JSON Format.
        - Location must just be the Country.
        - State must be a state from the country. Give a good location based on things, places not too popular and try not to recommend the same place.
        - From Asia, Europe, North America, South America, Oceania, and Africa choose one randomly that fits the passport requirements.
        - Make sure the selected location is not the place the users passport represents.
        - No desriptions needed.
        - Take into consideration all the possible places the user can travel with their given passports and visas for\
        a suitable holiday trip.
        - Consider locations which offers "Visa on arrival" and "Visa-Free Entry".
        - If the user does not have an exsisting visa to a place that they need to apply a visa to, do not recommend. 
        - If multiple people are traveling make sure that everyone can travel with whatever they have.
        - Validate each "Passort" and "Visa" if there are any. Try to understand what nationallity they are by plain text\
        but if the contents still dont make any sense throw "error" as true.
        - If "error" is true, add a "error_message" field explaining why it is an error.
        - Recommend a popular place half the time and the other half recommend a less popular place.

        IMPORTANT RANDOMIZATION INSTRUCTIONS:
        - For each recommended destination, deliberately consider both mainstream tourist destinations AND lesser-known countries that still offer visa-free travel for the given passport.
        - Ensure truly random selection by first selecting a random continent (that's accessible with the passport), then selecting a random country within that continent.
        - IMPORTANT: Include countries from ALL tiers of popularity - from major tourist destinations to hidden gems and everything in between.
        - In each recommendation, deliberately avoid suggesting destinations that are typically overrepresented in travel recommendations for that passport type.

        WHAT TO EXPECT:
        - "No. of Travelers" tells how many people are traveling. (Required)
        - "Traveler(s) information" says the following
            - "Passport" tells what passport the traveler is holding (Required)
            - "Visa" is an array of all the visa's the traveler has. (Optional)
        - "Departure Date" tells when the user wants to leave. (Required)
        - "Return Date" tells when the user wants to return. (Required)

        JSON format:
        {
            "error" : <bool>
            "data": {
                "location": "",
                "state": ""
            }
        }

        JSON REQUIREMENTS:
        - Do not add "\`\`\`json" when returning the result.
    `

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a travel advisor who gives diverse and unexpected recommendations based on the users needs.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 1.5,
        }),
    })

    if (response.ok) {
        const data = await response.json()
        const answerExtract = data.choices[0].message.content.trim()
        const jsonData = JSON.parse(answerExtract)

        if (jsonData["error"] == true) {
            return null
        }
        return jsonData
    }

    return null
}

/**
 * Gets general information about a location
 *
 * @param {string} location - The location to get information about
 * @returns {Promise<string>} A short description of the location
 */
export async function getGeneralInformation(location) {
    const prompt = `
        Give me some general information about this location ${location}.

        REQUIREMENTS:
        - Return only the result and dont add any unnecessary fillers like "Here is your result:".
        - The information must be said within 50 to 60 words.
    `

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a travel advisor who gives recommendations and feedback based on the users needs.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 1.0,
        }),
    })

    if (response.ok) {
        const data = await response.json()
        const info = data.choices[0].message.content

        return info
    }

    return null
}

/**
 * Checks spelling of location and state names and provides corrections
 *
 * @param {string} location - The country name to check
 * @param {string} state - The state/city name to check
 * @returns {Promise<Object>} Object indicating if correction is needed and corrected values
 */
export async function checkSpelling(location, city) {
    const prompt = `
        Check if the following have any spelling mistakes in them:
        Country: ${location}
        City: ${city}

        REQUIREMENTS:
        - ONLY return the result in JSON Format.
        - When checking for spelling mistakes, consider the relationship between country and city:
            - If city exists in a country with a similar spelling to the provided country, prefer that correction.
            - If country contains a city with a similar spelling to the provided city, prefer that correction.
        - Location must be the country name.
        - City must be a city that exists in the country.
        - If the location or city does not have any error or spelling mistakes, set "correction" as false, and don't give "data".
        - If there is a mistake in one or both, prioritize corrections that maintain a valid country-city relationship.
        - When checking for these locations make sure that they are valid locations in tripadvisor.
        - If you still cannot understand what the user was going for return "error" as true with nothing else as a JSON.
        
        JSON REQUIREMENTS:
        - Do not add "\`\`\`json" when returning the result.

        JSON format:
        {
            "correction" : <bool>
            "data": {
                "location": "",
                "city": ""
            }
        }
    `

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a travel advisor who gives recommendations and feedback based on the users needs.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.2,
        }),
    })

    if (response.ok) {
        const data = await response.json()
        const answerExtract = data.choices[0].message.content.trim()
        const jsonData = JSON.parse(answerExtract)

        return jsonData
    }

    return null
}

/**
 * Creates a day-by-day itinerary for a location
 *
 * @param {string} location - The location to create an itinerary for
 * @param {number} travelTime - The duration of the trip in days
 * @returns {Promise<Array>} Array of day objects with plans
 */
export async function createItinerary(location, travelTime) {
    const prompt = `
        Generate me an Itinerary.
        Location: ${location}
        Stay time: ${travelTime}
        
        REQUIREMENTS:
        - ONLY return the result in JSON Format.
        - Return it as a list of objects.
        - Day will say on which day of the trip should the user should do what. 
        - Plan is a array of objects. Generate the amount of plans base on how long they are staying for.
        - Generate at least 2 plans.
        - The object in array will give the Location of where to visit from the location.
        - To-do is a description of what to do in that location.

        JSON REQUIREMENTS:
        - Do not add "\`\`\`json" when returning the result.

        JSON format:
        {
            "Day" : int
            "Plan": <array>[{
                "Location": ""
                "To-do": ""
            }]
        }
    `

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a travel advisor who gives recommendations and feedback based on the users needs  content: 'You are a travel advisor who gives recommendations and feedback based on the users needs.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.9,
        }),
    })

    if (response.ok) {
        const data = await response.json()
        const answerExtract = data.choices[0].message.content.trim()
        const jsonData = JSON.parse(answerExtract)

        return jsonData
    }

    return null
}

/**
 * Gets hotel recommendations for a location
 *
 * @param {string} location - The location to get hotel recommendations for
 * @param {string} tdate - The departure date
 * @returns {Promise<Object>} Object containing hotel recommendations
 */
export async function getHotelReccomendations(location, tdate) {
    const prompt = `
        Recommend me some good hotels in ${location}.
        Time of depature: ${tdate}

        REQUIREMENTS:
        - ONLY return the result in JSON Format.
        - Hotel_ID must be a the hotel id for tripadvisor
        - Price must be a price per night the user can expect for the the following dates. Example "150$/night'(in cad)
        - Return at least 10 different hotels.

        JSON format:
        {
            "error" : <bool>
            "data": {
                "name": "",
                "Hotel_ID": "",
                "Price": ""
            }
        }

        JSON REQUIREMENTS:
        - Do not add "\`\`\`json" when returning the result.
    `

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a travel advisor who gives recommendations and feedback based on the users needs.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        }),
    })

    if (response.ok) {
        const data = await response.json()
        const answerExtract = data.choices[0].message.content.trim()
        const jsonData = JSON.parse(answerExtract)

        return jsonData
    }

    return null
}