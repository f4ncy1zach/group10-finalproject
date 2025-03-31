export default async function getDestination(body){
    const prompt = `
        Based on these following criterias and current situations give the best possible place to travel to.
        Here are the criterias:
        ${JSON.stringify(body)}

        REQUIREMENTS:
        - ONLY return the resutlt in JSON Format.
        - Location must just be the Country.
        - Make sure the selected location is not the place the users passport represents.
        - No desriptions needed.
        - Take into consideration all the possible places the user can travel with their given passports and visas for\
        a suitable holiday trip.
        - Consider locations which offers "Visa on arrival", "Visa-Free Entry", and places where it is easy to get a Visa with the passport provided.
        - Validate each "Passort" and "Visa" if there are any. Try to understand what nationallity they are by plain text\
        but if the contents still dont make any sense throw "error" as true.
        - If "error" is true, add a "error_message" field explaining why it is an error.

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
            }
        }

        JSON REQUIREMENTS:
        - Do not add "\`\`\`json" when returning the result.
    `;

    const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{role: 'system', content: 'You are a travel advisor who gives recommendations and feedback based on the users needs.'}, {role: 'user', content: prompt}],
                temperature: 0.7
            })
        }
    );

    if(response.ok){
        const data = await response.json();
        const answerExtract = data.choices[0].message.content.trim();
        const jsonData = JSON.parse(answerExtract);

        console.log(jsonData);
        return jsonData;
    }

    return null;
}