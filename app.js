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
        this.followUpState('WantHelpState').ask(speech);
    },

        'WantHelpState' : {
            'YesIntent' : function() {
               let speech = this.speechBuilder().addText("Awesome!  Look at you taking initiative already!  Well as you have probably heard, it only takes 21 days to build a new healthy habit.  So are you ready to get started?");
               this.followUpState('GettingStartedState').ask(speech);
            },

            'NoIntent'  : function() {
               let speech = this.speechBuilder().addText("No problem. I'll be here whenever you're ready to tell me about your goals.");
               this.tell(speech);
            },

            'Unhandled' : function() {
                let speech = this.speechBuilder().addText("Hey could you say yes or no?");
                this.followUpState('WantHelpState').ask(speech);
            }
        },
                   
        'GettingStartedState' : {
           'YesIntent' : function() {
               let speech = this.speechBuilder().addText("Ok, cool.  So let me tell you how this works.  It's as easy as 1, 2, 3.");
               .addBreak('500ms');
               .addText("First, you can add a new habit and I'll keep track of how many days in a row you've completed that habit.  ");
               .addBreak('500ms');
               .addText("Second, I'll remind you every day with a notification.  That is a reminder for you to update me on your progress.  I'll be there cheering you on every step of the way!");
               .addBreak('500ms');
               .addText("And finally, I can give you a progress update anytime you want.  And don't worry, if your goals change later on you can always remove a habit.  So what do you think, would you like to hear a few of my favorite habits to track?");
               this.followUpState('HearAboutHabitState').ask(speech);
            }
               
            'NoIntent' : function() {
               let speech = this.speechBuilder().addText("No problem. I'll be here whenever you're ready to tell me about your goals.");
               this.tell(speech);
            }
               
           'Unhandled' : function() {
               let speech = this.speechBuilder().addText("Hey, could you say yes or no?");
               this.followUpState('GettingStartedState').ask(speech);
           }
        }
               
        'HearAboutHabitState' : {
           'YesIntent' : function() {
               let speech = this.speechBuilder.addText("Love the energy! I'm happy to help you with your new journey. I have suggestions for the categories Happiness, Health, and Wealth. Which would you like to hear about?");
               this.followUpState('ChooseCategoryState').ask(speech);
           }
           'NoIntent' : function() {
               let speech = this.speechBuilder().addText("You got it! Would you like to give me a habit to start tracking?");
               this.followUpState('StartTrackingHabitState').ask(speech);
           }
           'Unhandled' : function() {
           let speech = this.speechBuilder().addText("The areas you can choose from are Happiness, Health, or Wealth. Or you can say none to move on.");
           this.followUpState('HearAboutHabitState').ask(speech);
           }
        }
       
        'ChooseCategoryState' : {
            'HappinessIntent' : function() {
               let speech = this.speechBuilder.addText("Studies show that we can improve our daily happiness by practicing gratitude! Setting some time aside every day to think about what you're grateful for can promote a positive outlook on life no matter your current circumstance. Would you like to hear another suggestion?");
               this.followUpState('WhichAreaState').ask(speech);
            }
            'HealthIntent' : function() {
               let speech = this.speechBuilder.addText("Studies show daily activity can help you sleep better, prevent chronic illness, and increase energy levels. It doesn't have to be long or strenuous, but consistency in your exercise routine should be the main goal. Would you like to hear another suggestion?");
               this.followUpState('WhichAreaState').ask(speech);
            }
            'WealthIntent' : function() {
               let speech = this.speechBuilder.addText("Being intentional about your money allows you to enable self-control, delaying immediate satisfaction that can positively affect many other aspects of your life. Make a budget that allows for consistent saving, and check in with me every day you stuck to your budget. Would you like to hear another suggestion?");
               this.followUpState('WhichAreaState').ask(speech);
            }
            'Unhandled' : function() {
               let speech = this.speechBuilder.addText("The areas you can choose from are Happiness, Health, or Wealth. Or you can say none to move on.");
               this.followUpState('ChooseCategoryState').ask(speech)
            }
            'NoneIntent' : function() {
               let speech = this.speechBuilder.addText("You got it! Would you like to give me a habit to start tracking?")
            }
               
        }
               
        'WhichAreaState' : {
            'YesIntent' : function() {
               let speech = this.speechBuilder.addText("Ok, sure. In which area?");
               this.followUpState('ChooseCategoryState').ask(speech);
               }
            'NoIntent' : function() {
               let speech = this.speechBuilder().addText("You got it! Would you like to give me a habit to start tracking?");
               this.followUpState('StartTrackingHabitState').ask(speech);
               }
            'Unhandled' : function() {
               let speech = this.speechBuilder.addText("Hey, could you say yes or no?");
               this.followUpState('WhichAreaState').ask(speech);
               }
        }
               
        'StartTrackingHabitState' : {
            //yes/no to habit tracking starts here
        }
       
            
    LaunchIntent() {
        let speech = this.speechBuilder().addText("Hey fam! Harmony here! Welcome back. Just letting you know you still have time to complete your habits for the day. What would you like to do? For a reminder of what I can help you with, just say, Help.")
        this.followUpState('AskHelpState').ask(speech);
        
    },   
          'AskHelpState' : {
              'HelpIntent' : function() {
               let speech = this.speechBuilder.addText("You can say List my habits to hear what habits I have been tracking so far, Add a habit to start tracking a new habit, Remove a habit to stop tracking a habit, or Update my progress to see how often you've completed habits and build on that!");
                  this.followUpState('HelpOptionsState').ask(speech)
             }
             'HelpOptionsState' : {
              'ListIntent' : function() {
               let speech = this.speechBuilder.addText("So far you have 'Practicing gratitude' and 'Waking up early' on your habit board. What else can I help you with?");
                  this.followUpState('HelpOptionsState').ask(speech)
             }
             'AddIntent' : function() {
                 let speech = this.speechBuilder.addText("That's what I'm talking about! What habt would you like to add?")
                 let habitAdded = this.$input.data.habit
                 let speech = this.speechBuilder.addText("This is the start of another healthy journey. I'll add " + habit + "to your habit board. Anything else I can help you with?")
                 this.followUpState('HelpOptionsState').ask(speech)
             }
              'RemoveIntent' : function() {
                 let speech = this.speechBuilder.addText("No worries! You can find different ways to be healthy. Which habit on your board would you like to remove?")
                 let habitRemoved = this.$input.data.habit
                 let speech = this.speechBuilder.addText("I removed Practicing gratitude from your habit board. Would you like help with anything else?")
             }
              'UpdateIntent : function() {
                 let speech = this.speechBuilder.addText("Of course! Have you completed 'Waking up early' today?")
                 this.followUpState('ProgressUpdateState').ask(speech);      
                 
                                                         So far you've completed  for 1 day in a row! Have you  I'm also tracking 'Practicing gratitude' which could use a bit more focus.")
                 this.followUpState(HelpOptionsState).ask(speech)
             }
              'NoIntent' : function() {
                  let speech = this.speechBuilder.addText("Keep at it chief! See you soon.")
                  this.tell(speech)
              }

          }
           
      'ProgressUpdateState' : {
          'YesIntent' : function() {
              let speech = this.speechBuilder.addText("You're that much closer to your goals! I'll add a day")
          }
          'NoIntent' : function() {
              
          }
      }
        },     
               

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
        
});

module.exports.app = app;
