import { jsonrepair } from 'jsonrepair'

export const parseAIGeneratedJSON = (text: string): object | null => {
  let d = null
  let stringToParse = text.replace('```json', '').replace('```', '')
  try {
    d = JSON.parse(stringToParse)
  } catch (e) {
    console.warn('cannot parse JSON, will try jsonrepair', e)
  }
  try {
    stringToParse = jsonrepair(stringToParse)
    d = JSON.parse(stringToParse)
  } catch (e) {
    console.warn(`Cannot parse JSOn, nor repair, will give up on string ${stringToParse}`, e)
  }
  return d
}
