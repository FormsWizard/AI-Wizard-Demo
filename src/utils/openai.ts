import { OpenAI } from 'openai'
console.log(process.env)
const openAIInstance = new OpenAI({
  dangerouslyAllowBrowser: true,
  organization: process.env.REACT_APP_OPENAI_ORGANIZATION,
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
})

export default openAIInstance

export const model = 'gpt-4o'
