// openai_chat.ts
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { get_encoding } from '@dqbd/tiktoken';
import * as dotenv from 'dotenv';
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export async function generateChatCompletion(messages: any[]): Promise<CreateChatCompletionResponse> {
  const text = messages
    .map((message: any) => {
      return message.role + ':' + message.content;
    })
    .join(',');

  const tokenCount = encode(text).length;
  console.log('Prompt Tokens', tokenCount);

  // TODO: check amount of tokens and trim text if necessary

  try {
    const response = await openai.createChatCompletion({
      messages,
      model: 'gpt-3.5-turbo'
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    throw error;
  }
}

function encode(input: string): Uint32Array {
  const tokenizer = get_encoding('gpt2');
  return tokenizer.encode(input);
}
