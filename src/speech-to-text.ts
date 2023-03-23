import speech from '@google-cloud/speech';
import * as fs from 'fs';

// Configure Google Speech-to-Text client
const client = new speech.SpeechClient();

export async function TranscribeAudioFile(filePath: string, languageCode: string,callback: (transcription: string) => void) {
  // Configure the request for Google Speech-to-Text API
  const config = {
    encoding: 'LINEAR16' as 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: languageCode,
  };
  const audio = {
    content: fs.readFileSync(filePath).toString('base64'),
  };
  const request = {
    config,
    audio,
  };

  // Send the request to the API and print the transcription
  try {
    const [response] = await client.recognize(request);
    const transcription = response.results!
      .map((result) => result.alternatives![0].transcript)
      .join('\n');

    console.log(`Transcription: ${transcription}`);
    callback(transcription);
  } catch (error) {
    console.error('Error transcribing the audio:', error);
  }
}