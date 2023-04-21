import { Configuration, OpenAIApi } from 'openai'
console.log(process.env)
const configuration = new Configuration({
  organization: process.env.REACT_APP_OPENAI_ORGANIZATION,
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
})
const openaiInstance = new OpenAIApi(configuration)

export default openaiInstance

export const model = 'text-davinci-003'
