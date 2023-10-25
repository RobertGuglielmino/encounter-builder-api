const { Configuration, OpenAIApi } = require("openai")
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
      }
    }
    
    if (event["imageDescription"] === "") {
      return {
        statusCode: 400,
        description: "imageDescription input cannot be empty",
      }
    }
      
    const encounterDescription = await getEncounter(event["encounterDescription"]);
    const encounterImage = await getImage(event["imageDescription"]);
    
    return {
      statusCode: 200,
      description: encounterDescription,
      image: !!encounterImage ? encounterImage : "encounterImage was not generated",
      datetime: new Date(Date.now()).toISOString()
    }
};



async function getEncounter(textInput) {
  //validation
  
  try {
  
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: textInput,
      max_tokens: 30,
      temperature: 0
    });
    
    return completion.data.choices[0].text;
    
  } catch {
    
  }
  
}

async function getEncounterDescription(textInput) {
  //validation
  
  try {
  
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: textInput,
      max_tokens: 30,
      temperature: 0
    });
    
    return completion.data.choices[0].text;
    
  } catch {
    
  }
  
}

async function getImage(description) {
  //validation
  
  console.log("sccop");
  
  try {
    
    
  console.log("sccop2");
  
    const image = await openai.createImage({
      prompt: description,
      size: "1024x1024",
      n: 1
    });  //  "Can you make me an easy Pathfinder 2nd edition encounter for five 13 level players" "A professionally drawn dnd battlemap of the nine hells"
    
    
  console.log("sccop3");
    
    // console.log("FULL " + completion);
    // console.log("DATA " + completion.data);
    // console.log("body " + completion.data.data[0].url);
    
    console.log("jere");
    
    return stringify(image.data.data[0].url)

    
  } catch {
    
  }
}