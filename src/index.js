import OpenAI from "openai";
import { autoResizeTextarea, checkEnvironment, setLoading, showStream } from "./utils.js";
import DOMPurify from "dompurify"
import { marked } from "marked";
checkEnvironment();

// Initialize an OpenAI client for your provider using env vars
const openai = new OpenAI({
    apiKey: process.env.AI_KEY,
    baseURL: process.env.AI_URL,
    dangerouslyAllowBrowser: true,
});

// Get UI elements
const giftForm = document.getElementById("gift-form");
const userInput = document.getElementById("user-input");
const outputContent = document.getElementById("output-content");

function start() {
    // Setup UI event listeners
    userInput.addEventListener("input", () => autoResizeTextarea(userInput));
    giftForm.addEventListener("submit", handleGiftRequest);
}

// Initialize messages array with system prompt
const messages = [
    {
        role: "system",
        content: `You are the Gift Genie!
        Make your gift suggestions thoughtful and practical.
        The user will describe the gift's recipient. 
        Your response must be in structured Markdown.
        Each gift must: 
        - Have a clear heading
        - A short explanation of why it would work

        Beware of the location or constraint mentioned, and adapt the ideas.
        Add a short section under each gift that guides the user on how to get the gift in that constrained context.

        Skip intros and conclusions. 
        Only output gift suggestions.
        
        End with a section with an H2 heading titled "Questions for you" 
        that contains follow-ups that would help improve the 
        gift suggestions`,
    },
];

async function handleGiftRequest(e) {
    // Prevent default form submission
    e.preventDefault();

    // Get user input, trim whitespace, exit if empty
    const userPrompt = userInput.value.trim();
    if (!userPrompt) return;

    // Set loading state
    setLoading(true);

    messages.push({
        role: "user",
        content: userPrompt
    })


    try {
        // Send a chat completions request and await its response
        const stream = await openai.chat.completions.create({
            model: "gpt-50",
            messages,
            stream: true
        });

        const giftSuggestions = ""

        showStream()

        for await(const chunk of stream) {
            // Extract gift suggestions from the assistant message's content
            const streamChunk = chunk.choices[0].delta.content
            giftSuggestions += streamChunk

            // Convert markedown to html
            const streamMarked = marked.parse(giftSuggestions)

            // Sanitize html
            const sanitize = DOMPurify.sanitize(streamMarked)
            
            // Display the gift suggestions
            outputContent.innerHTML = sanitize
        }

    } catch (error) {
        console.error(error)
        outputContent.textContent = 
            "Sorry, I can't access what I need right now. Please try again."
    } finally {
        // Clear loading state
        setLoading(false);
    }
}

start();
