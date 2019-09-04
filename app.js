'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { DynamoDb } = require('jovo-db-dynamodb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
    new DynamoDb()
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.toIntent('LaunchIntent')
    },

    LaunchIntent() {
        let speech = this.speechBuilder().addText("Hey there! My name’s Harmony. I understand you’re just checking me out, so no pressure. I'm here to help you build healthier habits to level up your life.  Do you think you could use help building healthier habits?")
        this.followUpState("WantHelpState").ask(speech);
    },

        'WantHelpState' : {
            'YesIntent' : function() {
                let speech = this.speechBuilder().addText("Awesome!  Look at you taking initiative already!  Well as you have probably heard, it only takes 21 days to build a new healthy habit.  So are you ready to get started?")
                this.followUpState("GettingStartedState").ask(speech)
            },

            'NoIntent'  : function() {
                let speech = this.speechBuilder().addText("No problem. I'll be here whenever you're ready to tell me about your goals.")
                this.tell(speech)
            },

            'Unhandled' : function() {
                let speech = this.speechBuilder().addText("Hey could you say yes or no?");
                this.followUpState('SecondState').ask(speech);
            }
        },
                   
        'GettingStartedState' : {
           'YesIntent' : function() {
                let speech = this.speechBuilder().addText("Ok, cool.  So let me tell you how this works.  It's as easy as 1, 2, 3.")
                .addBreak('500ms')
                .addText("First, you can add a new habit and I'll keep track of how many days in a row you've completed that habit.  ")
                .addBreak('500ms')
                .addText("Second, I'll remind you every day with a notification.  That is a reminder for you to update me on your progress.  I'll be there cheering you on every step of the way!")
               .addBreak('500ms')
               .addText("And finally, I can give you a progress update anytime you want.  And don't worry, if your goals change later on you can always remove a habit.  So what do you think, would you like to hear a few of my favorite habits to track?")
               this.followUpState(HearAboutHabitState).ask(speech)
            }
               
            'NoIntent' : function() {
               let speech = this.speechBuilder().addText("No problem. I'll be here whenever you're ready to tell me about your goals.")
               this.tell(speech)
            }
               
           'Unhandled' : function() {
               let speech = this.speechBuilder().addText("Hey could you say yes or no?");
               this.followUpState('GettingStartedState').ask(speech);
           }
        }
               
        'HearAboutHabitState' : {
           'YesIntent' : function() {
                let speech = this.speechBuilder.addText("Love the energy! I'm happy to help you with your new journey. I have suggestions for the categories Happiness, Health, and Wealth. Which would you like to hear about?")
                this.followUpState(ChooseCategoryState).ask(speech)
           }
           'NoIntent' : function() {
                let speech = this.speechBuilder().addText("You got it! Would you like to give me a habit to start tracking?")
                this.followUpState(StartTrackingHabitState).ask(speech)
           }
           'Unhandled' : function() {
           let speech = this.speechBuilder().addText("The areas you can choose from are Happiness, Health, or Wealth. Or you can say none to move on.");
           this.followUpState('HearAboutHabitState').ask(speech);
           }
        }
       
        'ChooseCategoryState' : {
            'HappinessIntent' : function() {
               let speech = this.speechBuilder.addText("Studies show that we can improve our daily happiness by practicing gratitude! Setting some time aside every day to think about what you're grateful for can promote a positive outlook on life no matter your current circumstance. Would you like to hear another suggestion?")
               this.followUpState(HearAboutHabitState).ask(speech)
               }
            'HealthIntent' : function() {
               let speech = this.speechBuilder.addText("Studies show daily activity can help you sleep better, prevent chronic illness, and increase energy levels. It doesn't have to be long or strenuous, but consistency in your exercise routine should be the main goal. Would you like to hear another suggestion?")
               this.followUpState(HearAboutHabitState).ask(speech)
               }
            'WealthIntent' : function() {
               let speech = this.speechBuilder.addText("Being intentional about your money allows you to enable self-control, delaying immediate satisfaction that can positively affect many other aspects of your life. Make a budget that allows for consistent saving, and check in with me every day you stuck to your budget. Would you like to hear another suggestion?")
               this.followUpState(HearAboutHabitState).ask(speech)
               }
       
        }
            
        
               
               

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});

module.exports.app = app;
