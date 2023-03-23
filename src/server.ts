import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';
import Microphone from 'node-microphone';
import keypress from 'keypress';
import * as dotenv from 'dotenv';
import { TranscribeAudioFile } from './speech-to-text';
import { Synthesize } from './text-to-speech';
// import { Synthesize } from './text-to-speech-elevenlabs';
import { generateChatCompletion } from './chat-completion';

dotenv.config();

// Configure the microphone
const mic = new Microphone({ bitwidth: 16, channels: 1, rate: 16000 });

// Create a writable stream to save the recorded audio
const recordingFilePath = path.resolve(__dirname, '../input.raw');

let isRecording = false;

const conversation: {role: string, content: string}[] = [];

// Make the `process.stdin` stream emit 'keypress' events
keypress(process.stdin);
process.stdin.setRawMode!(true);
process.stdin.resume();

console.log('Press the space bar to start recording.');
process.stdin.on('keypress', async (ch, key) => {
  if (key && key.ctrl && key.name === 'c') {
    // Exit the app when Ctrl+C is pressed
    process.exit();
  }

  if (key && key.name === 'space') {
    if (!isRecording) {
      // Start recording when the space bar is pressed for the first time
      startRecording();
    } else {
      // Stop recording when the space bar is pressed again
      await stopRecording();
    }
  }
});

let outputStream: Writable;

function startRecording() {
  isRecording = true;
  outputStream = fs.createWriteStream(recordingFilePath, { flags: 'w' });
  const micStream = mic.startRecording();
  micStream.pipe(outputStream);
  console.log('Recording started. Speak into the microphone...');
}

async function stopRecording() {
  console.log('Recording stopped. Transcribing...');
  isRecording = false;
  mic.stopRecording();  
  outputStream.end();

  const defaultInstructions = 'You are a helpful assistant. Answer the questions as best as you can. Keep your answers short and concise.';
  const instructions = process.env.INIT_PROMPT || defaultInstructions;

  await TranscribeAudioFile(recordingFilePath, 'en-US', async transcription => {
    const baseInstructions = `[Instructions: ${instructions}]\n`;

    // delete `[Instructions: ${instructions}]\n` from any previus message of the user to avoid repetition
    if (conversation.length > 0 && conversation[conversation.length - 2].role === 'user') {
      console.log('cleaning previous instructions');
      conversation[conversation.length - 2].content = conversation[conversation.length - 2].content.replace(baseInstructions, '');
    }

    conversation.push({
      role: 'user',
      content: baseInstructions + transcription,
    });

    const response = await generateChatCompletion(conversation);
    const responseMessage = response.choices[0].message?.content!;
    conversation.push({
      role: response.choices[0].message?.role!,
      content: responseMessage
    });

    Synthesize({
      languageCode: 'en-US', 
      ssmlGender: 'FEMALE' as 'FEMALE', 
      name: 'en-US-Neural2-C'
    },responseMessage);
  });
}
