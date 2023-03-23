# Look Ma No Hands GPT

This is a simple prototype of a node.js based speech-to-text -> GPT -> text-to-speech pipeline. It uses the [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text/) and [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech/) APIs to convert speech to text and text to speech, respectively. The [OpenAI GPT-3.5](https://openai.com/blog/better-language-models/) model is used to generate text from the speech-to-text output.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Google Cloud Platform account](https://cloud.google.com/) 
- [OpenAI API key](https://beta.openai.com/docs/developer-quickstart/1-creating-an-api-key)

## Setup

1. Clone this repository
2. Create a `.env` file in the root directory of the project and add the following environment variables:
    - `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google Cloud Platform service account key file
    - `OPENAI_API_KEY`: Your OpenAI API key
    - `INIT_PROMPT`: The initial prompt to use for the GPT model. Optional and defaults to a default prompt if not set.

### Text-to-speech alternative Eleven Labs

You can use the [Eleven Labs](https://www.eleven-labs.com/en/) text to speech service instead of Google Cloud Text-to-Speech. To do so, you need to create an account on the [Eleven Labs](https://www.eleven-labs.com/en/) website and get an API key. Then, you need to add the following environment variable to your `.env` file:
  - `ELEVENLABS_API_KEY`: Your Eleven Labs API key

Then you need to swap the import in the `server.ts` file from `text-to-speech.ts` to `text-to-speech-elevenlabs.ts`.

## Usage

1. Run `npm install` to install the dependencies
2. Run `npm start` to start the server
3. Wait until it says `Press the space bar to start recording.`;
4. Press the space bar to start recording and wait for the answer. It will take a few seconds to process the audio and generate the answer and is is relatively slow as is has not been optimized by using streaming APIs.

## Disclaimer

This is a prototype and is not intended for production use. It is not optimized for performance.
As with everything where you use your own API keys, you are responsible for the costs incurred by using this software.