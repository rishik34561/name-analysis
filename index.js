const Alexa = require('ask-sdk-core');
/** 
 * This handler is invoked when the user says the invocation "Name Analysis".
*/
const LaunchRequestHandler = {
    canHandle(handlerInput) {
      console.log("LaunchRequestHandler canHandle() called");
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      console.log("LaunchRequestHandler handle() called");
      const speechText = 'Welcome to Name Analysis. I can help you understand whether your first name is helping or hurting you… Please tell me your first name…';   
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};
/**
 * This handler is invoked right after the skill is launched when the user says his first name.
 */
const AnalyzeNameIntentHandler = {
    canHandle(handlerInput) {
        console.log("GetNameIntentHandler canHandle() called");
        if (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AnalyzeNameIntent') {
          console.log("GetNameIntentHandler returning true");
          return true;
        }
        else {
          console.log("GetNameIntentHandler returning false");
          return false;
        }
    },
    handle(handlerInput) {
        console.log("GetNameIntentHandler handle() called");
        const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
        console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
        const slotValues = getNameAndGender(filledSlots);
        const name = slotValues["name"];
        const gender = slotValues["gender"];
        console.log("name " + name + " gender " + gender);
        //TODO - call an external service to get name analysis for this name and gender
        //and include that in the output instead of the hard coded message here.
        const speechText = "As " + name + ", you have a natural interest in the welfare of your fellow man, and a desire to help and serve others in a humanitarian way. You are responsible and generous. Would you like to try another name?";
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
    }
};

const YesIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
      const speechText = "Ok, what is the first name?"
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
  }
};

const NoIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
      const speechText = "Ok, Bye, See you soon!"
      return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(true)
        .getResponse();
  }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      const speechText = 'Would you like to analyze your first name, say yes or no';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      const speechText = 'Goodbye!';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(true)
        .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
  
      return handlerInput.responseBuilder
        .speak('Sorry, I cannot figure out. Try again.')
        .reprompt('Sorry, I cannot figure out that sir. Try again.')
        .getResponse();
    },
};

// ======= Helper function =========
function getNameAndGender(filledSlots) {
  const slotValues = {};
  Object.keys(filledSlots).forEach((item) => {
    const name = filledSlots[item].name;
    slotValues[name] = filledSlots[item].value;
  });
  console.log(`Extracted slot values: ${JSON.stringify(slotValues)}`);
  return slotValues;
}
// ======== End Helper function

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    AnalyzeNameIntentHandler,
    YesIntentHandler,
    NoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();