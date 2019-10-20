'use strict';

const { Webhook, ExpressJS, Lambda } = require('jovo-framework');
const { app } = require ('./app.js');
//const Alexa = require('ask-sdk-core');
//const moment = require('moment: timezone');

// ------------------------------------------------------------------
// The reminder API is commented out in order for testing to work, but will eventually be needed in order to set up reminders
// ------------------------------------------------------------------
/*
const CreateReminderIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type == 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name == 'YesIntent'
    },
    handle(handlerInput){
        const remindersApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient()
        const speech = 'Yeet reminders';
        return handlerInput.responseBuilder
            .speak(speech)
            .getResponse();
    }
};
*/
//const Alexa = require('ask-sdk-core');

/*const messages = {
  WELCOME: 'Would you like to create a daily reminder at one pm?',
  WHAT_DO_YOU_WANT: 'What would you like to do?',
  NOTIFY_MISSING_PERMISSIONS: 'Please enable Reminder permissions in the Amazon Alexa app using the card I\'ve sent to your Alexa app.',
  ERROR: 'Uh Oh. Looks like something went wrong.',
  API_FAILURE: 'There was an error with the Reminders API.',
  GOODBYE: 'Bye! Thanks for using the Reminders API Skill!',
  UNHANDLED: 'This skill doesn\'t support that. Please ask something else.',
  HELP: 'You can use this skill by asking something like: create a reminder?',
  REMINDER_CREATED: 'OK, I will remind you in 30 seconds.',
  UNSUPPORTED_DEVICE: 'Sorry, this device doesn\'t support reminders.',
  WELCOME_REMINDER_COUNT: 'Welcome to the Reminders API Demo Skill.  The number of your reminders related to this skill is ',
  NO_REMINDER: 'OK, I won\'t remind you.',
};

const PERMISSIONS = ['alexa::alerts:reminders:skill:readwrite'];

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const requestEnvelope = handlerInput.requestEnvelope;
    const responseBuilder = handlerInput.responseBuilder;
    const consentToken = requestEnvelope.context.System.apiAccessToken;

    if (!consentToken) {
      // if no consent token, skip getting reminder count
      return responseBuilder
        .speak(messages.WELCOME)
        .reprompt(messages.WHAT_DO_YOU_WANT)
        .getResponse();
    }
    try {
      const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
      const remindersResponse = await client.getReminders();
      console.log(JSON.stringify(remindersResponse));

      // reminders are retained for 3 days after they 'remind' the customer before being deleted
      const remindersCount = remindersResponse.totalCount;

      return responseBuilder
        .speak(`${messages.WELCOME_REMINDER_COUNT} ${remindersCount}. ${messages.WHAT_DO_YOU_WANT}`)
        .reprompt(messages.WHAT_DO_YOU_WANT)
        .getResponse();
    } catch (error) {
      console.log(`error message: ${error.message}`);
      console.log(`error stack: ${error.stack}`);
      console.log(`error status code: ${error.statusCode}`);
      console.log(`error response: ${error.response}`);

      if (error.name === 'ServiceError' && error.statusCode === 401) {
        console.log('No reminders permissions (yet).  Skipping reporting on reminder count.');
        return responseBuilder
          .speak(messages.WELCOME)
          .reprompt(messages.WHAT_DO_YOU_WANT)
          .getResponse();
      }
      if (error.name !== 'ServiceError') {
        console.log(`error: ${error.stack}`);
        const response = responseBuilder.speak(messages.ERROR).getResponse();
        return response;
      }
      throw error;
    }
  },
};

const CreateReminderHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'YesIntent';
  },
  async handle(handlerInput) {
    const requestEnvelope = handlerInput.requestEnvelope;
    const responseBuilder = handlerInput.responseBuilder;
    const consentToken = requestEnvelope.context.System.apiAccessToken;

    // check for confirmation.  if not confirmed, delegate
    switch (requestEnvelope.request.intent.confirmationStatus) {
      case 'CONFIRMED':
        // intent is confirmed, so continue
        console.log('Alexa confirmed intent, so clear to create reminder');
        break;
      case 'DENIED':
        // intent was explicitly not confirmed, so skip creating the reminder
        console.log('Alexa disconfirmed the intent; not creating reminder');
        return responseBuilder
          .speak(`${messages.NO_REMINDER} ${messages.WHAT_DO_YOU_WANT}`)
          .reprompt(messages.WHAT_DO_YOU_WANT)
          .getResponse();
      case 'NONE':
      default:
        console.log('delegate back to Alexa to get confirmation');
        return responseBuilder
          .addDelegateDirective()
          .getResponse();
    }

    if (!consentToken) {
      return responseBuilder
        .speak(messages.NOTIFY_MISSING_PERMISSIONS)
        .withAskForPermissionsConsentCard(PERMISSIONS)
        .getResponse();
    }
    try {
      const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();

      const currentDateTime = moment().tz('America/Los_Angeles'),
        reminderRequest = {
          requestTime: currentDateTime.format(YYYY-MM-DDTHH:mm:ss),
          trigger: {
            timeZoneId : "America/Los_Angeles",
            scheduledTime : currentDateTime.set({
              hour: "13"
              minutes: "00"
              seconds: "00"
            }).format(YYYY-MM-DDTHH:mm:s),
            timeZoneId: 'America/Los_Angeles'
            recurrence: {
              freq: "DAILY"
            }
            type: 'SCHEDULED_ABSOLUTE',
          },
          alertInfo: {
            spokenInfo: {
              content: [{
                locale: 'en-US',
                text: "Hey it's Harmony! This is your reminder to work on your habits and update me when you do!",
              }],
            },
          },
          pushNotification: {
            status: 'ENABLED',
          },
        };
      const reminderResponse = await client.createReminder(reminderRequest);
      console.log(JSON.stringify(reminderResponse));
    } catch (error) {
      if (error.name !== 'ServiceError') {
        console.log(`error: ${error.stack}`);
        const response = responseBuilder.speak(messages.ERROR).getResponse();
        return response;
      }
      throw error;
    }

    return responseBuilder
      .speak(messages.REMINDER_CREATED)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const UnhandledHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.UNHANDLED)
      .reprompt(messages.UNHANDLED)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.HELP)
      .reprompt(messages.HELP)
      .getResponse();
  },
};

const CancelStopHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.GOODBYE)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle(handlerInput, error) {
    return error.name === 'ServiceError';
  },
  handle(handlerInput, error) {
    // console.log(`ERROR STATUS: ${error.statusCode}`);
    console.log(`ERROR MESSAGE: ${error.message}`);
    // console.log(`ERROR RESPONSE: ${JSON.stringify(error.response)}`);
    // console.log(`ERROR STACK: ${error.stack}`);
    switch (error.statusCode) {
      case 401:
        return handlerInput.responseBuilder
          .speak(messages.NOTIFY_MISSING_PERMISSIONS)
          .withAskForPermissionsConsentCard(PERMISSIONS)
          .getResponse();
      case 403:
        return handlerInput.responseBuilder
          .speak(`${messages.UNSUPPORTED_DEVICE} ${messages.WHAT_DO_YOU_WANT}`)
          .reprompt(messages.WHAT_DO_YOU_WANT)
          .getResponse();
      default:
        return handlerInput.responseBuilder
          .speak(messages.API_FAILURE)
          .getResponse();
    }
  },
};

const RequestLog = {
  async process(handlerInput) {
    console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
  },
};

const ResponseLog = {
  process(handlerInput) {
    console.log(`RESPONSE = ${JSON.stringify(handlerInput.responseBuilder.getResponse())}`);
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    CreateReminderHandler,
    SessionEndedRequestHandler,
    HelpHandler,
    CancelStopHandler,
    UnhandledHandler,
  )
  .addRequestInterceptors(RequestLog)
  .addResponseInterceptors(ResponseLog)
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .withCustomUserAgent('cookbook/reminders/v1')
  .lambda();*/


//The following needs to exist in order for AWS Lambda to work and to be able to test app.js
// ExpressJS (Jovo Webhook)
if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.JOVO_PORT || 3000;
    Webhook.jovoApp = app;

    Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}.`);
    });

    Webhook.post('/webhook', async (req, res) => {
        await app.handle(new ExpressJS(req, res));
    });
}



// AWS Lambda
exports.handler = async (event, context, callback) => {
    await app.handle(new Lambda(event, context, callback));
};

/*exports.handler= Alexa.SkillBuilders.custom()
    .withApiClient(new Alexa.defaultApiClient())*/
