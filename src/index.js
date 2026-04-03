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

const systemPrompt = `You are the Gift Genie that can search the web! 

You generate gift ideas that feel thoughtful, specific, and genuinely useful.
Your output must be in structured Markdown.
Do not write introductions or conclusions.
Start directly with the gift suggestions.

Each gift must:
- Have a clear heading with the actual product's name
- Include a short explanation of why it works
- Include the current price or a price range
- Include one or more links to websites or social media business pages
where the gift can be bought

Prefer products that are widely available and well-reviewed.
If you can't find a working link, say so rather than guessing.

If the user mentions a location, situation, or constraint,
adapt the gift ideas and add another short section 
under each gift that guides the user to get the gift in that 
constrained context.

After the gift ideas, include a section titled "Questions for you"
with clarifying questions that would help improve the recommendations.

Finish with a section with H2 heading titled "Wanna browse yourself?"
with links to various ecommerce sites with relevant search queries and filters 
already applied.`;


async function handleGiftRequest(e) {
    // Prevent default form submission
    e.preventDefault();

    // Get user input, trim whitespace, exit if empty
    const userPrompt = userInput.value.trim();
    if (!userPrompt) return;

    // Set loading state
    setLoading(true);

    // messages.push({
    //     role: "user",
    //     content: userPrompt
    // })


    try {
        // Send a chat completions request and await its response
        const response = await openai.responses.create({
            model: process.env.AI_MODEL,
            input: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt}
            ],
            tools: [{ types: "web_search_preview" }]
        });

        const giftSuggestions = response.output_text

        showStream()

        // for await(const chunk of stream) {
        //     // Extract gift suggestions from the assistant message's content
        //     const streamChunk = chunk.choices[0].delta.content
        //     giftSuggestions += streamChunk

        //     // Convert markedown to html
        //     const streamMarked = marked.parse(giftSuggestions)

        //     // Sanitize html
        //     const sanitize = DOMPurify.sanitize(streamMarked)
            
        //     // Display the gift suggestions
        //     outputContent.innerHTML = sanitize
        // }

        // Convert Markdown to HTML
        const html = marked.parse(giftSuggestions);

        // Sanitize the HTML to prevent XSS attacks
        const safeHTML = DOMPurify.sanitize(html);

        // Render the output
        outputContent.innerHTML = safeHTML;

        console.log(giftSuggestions);

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
