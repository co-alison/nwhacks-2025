const { CohereClient } = require("cohere-ai");
const axios = require('axios');

const cohere = new CohereClient({
  token: "",
});

const getLetterFromSpeech = async (speechInput) => {
  try {
    const apiEndpoint = 'https://api.cohere.ai/v1/generate';

    const apiKey = '';

    const prompt = `You are a speech recognition model. Given the user's speech, identify the letter they intended to say. If the speech sounds similar to a letter's name in US English, return the letter that the user most likely meant. Return only the single letter, with no explanation or additional words.\n\nExamples: \n\nInput: 'Tea'\nOutput: 'T'\n\nInput: 'Bee'\nOutput: 'B'\n\nInput: 'Sea'\nOutput: 'C'\n\nInput: 'Jay'\nOutput: 'J'\n\nInput: 'Kay'\nOutput: 'K'\n\nInput: 'Ess'\nOutput: 'S'\n\nInput: 'Dee'\nOutput: 'D'\n\nInput: 'Why'\nOutput: 'Y'\n\nInput: 'You'\nOutput: 'U'\n\nInput: 'Em'\nOutput: 'M'\n\nInput: 'Arr'\nOutput: 'R'\n\nInput: 'Are'\nOutput: 'R'\n\nInput: 'Double U'\nOutput: 'W'\n\nInput: '${speechInput}'\nOutput:`;

    const response = await axios.post(apiEndpoint, {
      prompt: prompt,
      max_tokens: 10,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    const result = response.data.generations[0].text.trim();
    return result;
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    return null;
  }
};

module.exports = getLetterFromSpeech;