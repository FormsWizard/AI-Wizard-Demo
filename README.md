# An AI Form generator showcase 

This is a showcase of a form generator that uses AI to generate forms. The form generator is built using the [Streamlit](https://www.streamlit.io/) library and the [Hugging Face](https://huggingface.co/) library. The form generator uses the [GPT-2](https://huggingface.co/gpt2) model to generate the form fields based on the user input.

In addition, the generated form can be filled by analyzing a file provided by the user. The form fields are filled based on the content of the file.

The form generator can be used to generate forms for various purposes such as surveys, questionnaires, feedback forms, etc.

## User Manual

When you open the Demo you will e asked for a valid OpenAI Key, which is needed to use the GPT-2 model. You can get an API key from the OpenAI website.
Because we run in a serverless environment, the key is not stored and you will need to provide it every time you run the demo.

Once you provide the API key, you can enter the text that you want to use as input for the form generator. The form generator will then generate the form fields based on the input text.

Click on "KI gestütztes Formular generieren" to open a prompt where you can enter the text that you want to use as input for the form generator. The form generator will then generate the form fields based on the input text.
You can also click on the microphone icon to use speech-to-text to enter the input text.

After clicking in "Submit" the form will be generated.

You can review the generated form and the JSON-Schema, that the AI has generated based on you prompt. Currently we have set a maxToken limit of 3000 tokens, which means that the AI will only generate 1000 tokens. If you want to generate more tokens, you can change the maxToken limit in the code.
So don't expect huge data schemata to be generated at once. Nevertheless you can save each generated form by clicking "apply" and reuse that form later. This means you can nest forms and create complex data structures.

## Where is my data stored?

Because this is a serverless live Demo your data is only stored within the browsers local storage. This means that if you close the browser or clear the cache, your data will be lost. If you want to store your data permanently you can download the JSON-Schema and save it on your local machine.
You can download and restore the data at any time using the initial greeting screen.

## How can I use the generated form?

When you click on "Formular ersetzen" in the Left Sidebar, you can replace the current form with a new one. You can also drag and drop into the current form to create a deeper nested form. This way you can create complex data structures.