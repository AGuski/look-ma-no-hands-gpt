import voice from 'elevenlabs-node';
import playSound from 'play-sound';
import * as dotenv from 'dotenv';
dotenv.config();

const player = playSound({});

export async function Synthesize(voiceConfig: { languageCode: string; ssmlGender: "FEMALE"; name: string; }, text: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY; // Your API key from Elevenlabs
  const voiceID = 'kzgYQMrbOzZSAwbk8LPm';            // The ID of the voice you want to get
  const fileName = 'output.mp3';                      // The name of your audio file
  const textInput = text;
  // const stability = 20; // percent -> lower means more variance

  const response = await voice.textToSpeech(apiKey, voiceID, fileName, textInput);
  console.log(response);
  console.log('Audio content written to file: output.mp3');
  player.play('output.mp3', function(err){
    if (err) throw err
  });

  // const [response] = await client.synthesizeSpeech(request);
  // // Write the binary audio content to a local file
  // const writeFile = util.promisify(fs.writeFile);
  // await writeFile('output.mp3', response.audioContent!, 'binary');
  // console.log('Audio content written to file: output.mp3');
  // player.play('output.mp3', function(err){
  //   if (err) throw err
  // });
}
