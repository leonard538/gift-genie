import { checkEnvironment } from "./utils";
import OpenAi from "openai"

checkEnvironment()

const openai = new OpenAi({
    apiKey: process.env.AI_KEY,
    apiUrl: process.env.AI_URL,
    dangerouslyAllowBrowser: true
})

const userPrompt = ""

const userMessage = {
    role: "user",
    content: userPrompt
}

const response = await openai.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: [ userMessage ]
})

console.log(response)