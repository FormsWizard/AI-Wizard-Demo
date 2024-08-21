# AI Form Generator Showcase

This repository showcases an AI-powered form generator that leverages the [GPT-4o-mini](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/) model from OpenAI to dynamically generate form fields based on user-provided input. The application is capable of filling out the forms by analyzing content from user-supplied files.

The form generator is designed for various applications including surveys, questionnaires, and feedback forms among others.

## User Manual

Upon launching the demo, users are prompted to enter a valid OpenAI API key, necessary for utilizing the GPT-4 model. API keys can be obtained directly from the OpenAI website. Due to the serverless nature of the environment, the key must be provided each time the demo is run.

To initiate form generation, select "KI gestütztes Formular generieren" to input text that will serve as the basis for the form fields. Alternatively, the microphone icon allows for speech-to-text input.

Once the "Submit" button is clicked, the form is generated and can be reviewed along with the JSON Schema produced by the AI based on the provided prompt. A token limit of 3000 has been set; however, adjustments to this limit can be made in the code to accommodate larger data schemas. Each form can be saved for later use by selecting "apply," facilitating the creation of nested forms and complex data structures.

## Data Storage

As this is a live serverless demo, data is stored locally within the browser's storage. Closing the browser or clearing the cache will result in data loss. For permanent storage, users can download the Data and Schemata and save it on their device. Data can be restored at any time from the initial greeting screen.

## Utilizing the Generated Form

By selecting "Formular ersetzen" in the left sidebar, users can replace the current form with a new one or integrate additional forms through drag-and-drop, allowing for the creation of complex data structures.

## Example

### Festival organization

Prompt used for the example:
```
All important form fields for the organization of a festival, including helpers, stuff, equipment, stages, location plan and so on... be very precise on the granularity of a stage and bar organization. 
```

<p align="center">
<img alt="AI-Form-Wizard-Screenshot_20240820_093603" src="https://github.com/user-attachments/assets/852b1f14-c8b3-46ef-95ba-fd2bdfd53330" width="300" />
</p>

