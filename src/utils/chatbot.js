const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function processMessageToChatGPT(userMessage) {
    const messages = [
        {
            role: "system",
            content: "You are a helpful travel assistant providing clear and accurate travel advice." // Can be changed like making it talk like a pirate
        },
        {
            role: "user",
            content: userMessage
        }
    ];

    const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": messages
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        });

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            // Return the assistant's response
            return data.choices[0].message.content;
        } else {
            console.error("Unexpected API response format:", data);
            return "Sorry, I couldn't process your request.";
        }
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        return "Sorry, there was an error processing your request.";
    }
}