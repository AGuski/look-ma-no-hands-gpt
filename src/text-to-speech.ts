import * as fs from 'fs';
import * as util from 'util';
import textToSpeech from '@google-cloud/text-to-speech';
import playSound from 'play-sound';

const player = playSound({});

export async function Synthesize(voiceConfig: { languageCode: string; ssmlGender: "FEMALE"; name: string; }, text: string) {

  const client = new textToSpeech.TextToSpeechClient();

  const request = {
    input: {text: text},
    voice: voiceConfig,
    audioConfig: {audioEncoding: 'MP3' as 'MP3'},
  };

  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent!, 'binary');
  console.log('Audio content written to file: output.mp3');
  player.play('output.mp3', function(err){
    if (err) throw err
  });
}
