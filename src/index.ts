// Import necessary modules and initialize clients
import { ElevenLabsClient, play } from 'elevenlabs';
import { fs } from 'fs';

// Initialize ElevenLabsClient with the API key
const elevenlabs = new ElevenLabsClient({
    apiKey: 'YOUR_API_KEY'
});

// Step 1: Create a Pronunciation Dictionary
async function createDictionary() {
    const xmlData = fs.readFileSync("path_to_pronunciation_dictionary.xml", "utf8");
    // Assume xmlData is parsed and converted to the appropriate format
    const response = await elevenlabs.pronunciationDictionary.addFromFile({
        file: xmlData,  // Assuming convert to form-data format
        name: "TomatoDictionary"
    });
    console.log('Dictionary Created:', response);
    return response.id;  // Return the created dictionary ID for further use
}

// Step 2: Generate Audio for "tomato"
async function generateTomatoAudio() {
    const audio = await elevenlabs.generate({
        voice: "Rachel",
        voiceId: "VOICE_ID_RACHEL",
        text: "tomato",
        model_id: "eleven_multilingual_v2"
    });
    await play(audio);
}

// Step 3: Remove "tomato" rules from Pronunciation Dictionary
async function removeTomatoRules(dictionaryId: string) {
    const removeResponse = await elevenlabs.pronunciationDictionary.removeRulesFromThePronunciationDictionary({
        pronunciationDictionaryId: dictionaryId,
        rule_strings: ["tomato", "Tomato"]
    });
    console.log('Rules Removed:', removeResponse);
}

// Step 5: Add "tomato" Rules Using Phonemes
async function addTomatoPhonemeRules(dictionaryId: string) {
    const addResponse = await elevenlabs.pronunciationDictionary.addRulesToThePronunciationDictionary({
        pronunciationDictionaryId: dictionaryId,
        rules: [
            { string_to_replace: "tomato", phoneme: "təˈmeɪtoʊ", alphabet: "IPA", type: "phoneme" },
            { string_to_replace: "Tomato", phoneme: "Təˈmeɪtoʊ", alphabet: "IPA", type: "phoneme" }
        ]
    });
    console.log('Rules Added:', addResponse);
}

// Main function to orchestrate the operations
async function main() {
    const dictionaryId = await createDictionary();
    await generateTomatoAudio(); // Step 2
    await removeTomatoRules(dictionaryId); // Step 3
    await generateTomatoAudio(); // Step 4
    await addTomatoPhonemeRules(dictionaryId); // Step 5
    await generateTomatoAudio(); // Step 6
}

main();
