const { Configuration, OpenAIApi } = require("openai");
const { stringify } = require("flatted");


const configuration = new Configuration({
  organization: "org-ivm4tm4nPGeei7Kk9Ovbhafg", // Replace with your OpenAI organization ID
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
    //validation
    if (event["encounterDescription"] === "") {
      return {
        statusCode: 400,
        description: "encounterDescription input cannot be empty",
      };
    }
    
    const encounter = await getEncounter(event["encounterDescription"]);
    const encounterTitle = await getEncounterTitle(encounter);
    const encounterDescription = await getEncounterDescription(encounter);
    const encounterImage = await getImage(encounterDescription);
    
    return {
      statusCode: 200,
      title: encounterTitle,
      description: encounter,
      image: !!encounterImage ? encounterImage : "encounterImage was not generated",
      datetime: new Date(Date.now()).toISOString()
    };
};



async function getEncounter(textInput) {
  //validation
  
  
  const formattedInput = textInput + ", and give the encounter a title, formatted by putting it in between two @ symbols."
  
  try {
  
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: formattedInput,
      max_tokens: 3000,
      temperature: 0.5
    });
    
    return completion.data.choices[0].text;
    
  } catch {
    
  }
  
}

async function getEncounterDescription(textInput) {
  //validation
  
  const formattedInput = "Write an input to OpenAI describing a top-down tabletop battlemap given the following description: " + textInput;
  
  try {
  
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: formattedInput,
      max_tokens: 200,
      temperature: 0.5
    });
    
    return completion.data.choices[0].text;
    
  } catch {
    
  }
  
}

async function getEncounterTitle(textInput) {
  //validation
  
  const formattedInput = "Give me a three word title to the following role playing game encounter " + textInput;
  
  try {
  
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: formattedInput,
      max_tokens: 8,
      temperature: 0.1
    });
    
    return completion.data.choices[0].text;
    
  } catch {
    
  }
  
}

async function getImage(description) {
  //validation
  
  
  try {
    
    const image = await openai.createImage({
      prompt: description,
      size: "1024x1024",
      n: 1
    });  //  "Can you make me an easy Pathfinder 2nd edition encounter for five 13 level players" "A professionally drawn dnd battlemap of the nine hells"
    
    
  
    console.log("FULL " + image);
    // console.log("DATA " + completion.data);
    // console.log("body " + completion.data.data[0].url);
    
    return image.data.data[0].url

    
  } catch (error) {
    console.log(error.response.data);
  }
}