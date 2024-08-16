import { useState } from 'react'
import openAIInstance, { model } from '../../utils/openai'
import { threadId } from 'worker_threads'

export const UploadAnalyzeGPT = () => {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    setLoading(true)

    try {
      const client = openAIInstance

      // Upload the file to OpenAI
      /*const response = await client.files.create({
        file: new File([file], file.name),
        purpose: 'assistants', // Change the purpose according to your need
      });*/

      const vectorStore = await client.beta.vectorStores.create({ name: 'File Upload' })
      console.log('Vector Store ID:', vectorStore.id)

      const batch = await client.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
        files: [new File([file], file.name)],
      })
      console.log({ batch })

      const assistant = await client.beta.assistants.create({
        model: model,
        instructions: 'You are a knowledgeable assistant that uses the provided files to answer questions.',
        tools: [{ type: 'file_search' }],
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStore.id], // Attach vector store containing your files
          },
        },
      })

      console.log('Assistant ID:', assistant.id)
      console.log({ assistant })

      const thread = await client.beta.threads.create()
      console.log('Thread ID:', thread.id)

      const message = await client.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: 'Summarize what can be seen at the image',
      })

      const run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      })

      console.log({ run })

      let interval = setInterval(async () => {
        const status = await client.beta.threads.runs.retrieve(thread.id, run.id)
        if (status.status === 'completed') {
          clearInterval(interval)
          const messages = await client.beta.threads.messages.list(thread.id)
          console.log({ messages })
        }
      }, 1000)

      //setSummary(run.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error uploading file:', error)
      setSummary('An error occurred while summarizing the file.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept="image/*" />
      {loading && <p>Uploading and summarizing the file...</p>}
      {summary && <p>Summary: {summary}</p>}
    </div>
  )
}
