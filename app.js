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


var habitArray = [];
var habitCount = 0;

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
               let speech = this.speechBuilder.addText("You got it! Would you like to give me a habit to start tracking?");
               this.followUpState('StartTrackingHabitState').ask(speech);
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
            'YesIntent' : function() {
               let speech = this.speechBuilder.addText("Great! What habit would you like to start tracking?");
               this.followUpState('FirstHabitState').ask(speech);
               }
            'NoIntent' : function() {
               let speech = this.speechBuilder.addText("That's ok! You can always add a new habit later. I look forward to hearing about your goals when you're ready.");
               this.tell(speech);
               }
            'Unhandled' : function() {
               let speech = this.speechBuilder.addText("Hey, can you say yes or no?");
               this.followUpState('StartTrackingHabitState').ask(speech);
               }
        }
               
        'FirstHabitState' : {
            'AddFirstHabitIntent' : function(habit) {
               let speech = this.speechBuilder.addText("Healthy habits lead to a healthy life without even thinking about it.") //more encouragement statements can be rotated through here
               
               .addText("I'll add " + habit.value + "to your board. Would you like to add another habit to your board?");
               habitArray.push(habit.value);
               this.followUpState('StartAnotherHabitState').ask(speech);
               }
        }
               
        'StartAnotherHabitState' : {
            'YesIntent' : function() {
               let speech = this.speechBuilder.addText("Ok! I'm ready to hear it. What habit are we going to track?");
               this.followUpState('AddAnotherHabitState').ask(speech);
               }
            'NoIntent' : function() {
               let speech = this.speechBuilder.addText("Ok! If you think of anything else, just say 'I'd like to add a habit'. Would you like to set up daily reminders for your habit board?")
               this.followUpState('RemindersState').ask(speech);               }
        }
        
        'AddAnotherHabitState' : {
            'AddHabitIntent' : function(nextHabit) {
               let speech = this.speechBuilder.addText("That's a good one!") //encouragement statements
               
               .addText("I'll put " + nextHabit.value + "on your board. Let me know at any time if you've completed your habit for the day. Would you like to set up any more habits?");
               habitArray.push(nextHabit.value);
               this.followUpState('StartAnotherHabitState').ask(speech);
               }
        }
               
        'RemindersState' : {
            'YesIntent' : function() {
               let speech = this.speechBuilder.addText("Will do! I'll remind you in the evening to track your habits.");
               // ask about specific times to remind user about tracking habits
               }
            'NoIntent' : function() {
               let speech = this.speechBuilder.addText("No problem! If you decide later you want to turn them on, just say 'Start reminding me of my habits.' Just don't forget about me and let me know when you accomplish tasks. I'm always excited to hear about your progress!");
               this.tell(speech);
               }
        }
       
            
    LaunchIntent() {
        let speech = this.speechBuilder().addText("Hey fam! Harmony here! Welcome back. Just letting you know you still have time to complete your habits for the day. What would you like to do? For a reminder of what I can help you with, just say, Help.");
        this.followUpState('HelpOptionstate').ask(speech);
        
    },   
          'HelpOptionsState' : {
              'HelpIntent' : function() {
                  let speech = this.speechBuilder.addText("You can say List my habits to hear what habits I have been tracking so far, Add a habit to start tracking a new habit, Remove a habit to stop tracking a habit, or Update my progress to let me know which habits you've completed today");
                  this.followUpState('HelpOptionsState').ask(speech)
             }
         
              'ListIntent' : function() {
                  // User Persistence: Habits Tracked
                  if (habitCount > 0)
                  let speech = this.speechBuilder.addText("You are currently tracking "+ habitCount + "habits." + habitArray + What else can I help you with?");
                  else
                      let speech = this.speechBuilder.addText("So far I am not tracking any habits for you. You can say 'Add a habit' to start a new journey with me.")
                  this.followUpState('HelpOptionsState').ask(speech)
             }
             'AddIntent' : function() {
                 let speech = this.speechBuilder.addText("That's what I'm talking about!", "You're on a roll dude!", "Another day, another habit being formed", "Way to bring it today!")
                 let speech = this.speechBuilder.addText("What habit would you like to add?")
                 let habitAdded = this.$input.data.habitAdded
                 let speech = this.speechBuilder.addText("This is the start of another healthy journey. I'll add " + habitAdded + "to your habit board. Anything else I can help you with?")
                 this.followUpState('HelpOptionsState').ask(speech)
             }
              'RemoveIntent' : function() {
                 // Encouragement Line (removing habit specific)
                 if (habitCount > 0)
                     let speech = this.speechBuilder.addText("No worries! You can find different ways to be healthy.", "Producitivity doesn't always equal happiness", "We'll find something that gives you more satisfaction in the future!")
                     {
                     let speech = this.speechBuilder.addText("Which habit on your board would you like to remove?")
                     let habitRemoved = this.$input.data.habitRemoved
                     bool found = false
                     for (int i : habitArray) {
                        if (habitArray[i] == habitRemoved) 
                             array.splice(index, i)
                             found = true
                    }
                    if (found)
                     let speech = this.speechBuilder.addText("I removed " + habitRemoved + " from your habit board. Would you like help with anything else?")
                     //else
                     //    let speech = this.speechBuilder.addText("I did not find that habit. Would you like to try again?")
                     //    let tryResponse = this.$input.data.tryResponse
                     //    if 
                     //}
                  else
                        let speech = this.speechBuilder.addText("I'm currently not tracking any habits to remove. Is there anything else you need help with?") 
             }
              'UpdateIntent : function() {
                let speech = this.speechBuilder.addText("Of course!")
                 // if (habitCount == 0)
                      let speech = this.speechBuilder.addText("I'm currently not tracking any habits that I can update. You can say 'Add a habit' to start a tracking your progress")
                 // else if (habitCount >= 1)
                 //     for(i in habitList)
                 //         if (habitList[i] == 0)
                                // User Persistence: habits tracked
                                let speech = this.speechBuilder.addText("I'm tracking 'Practicing gratitude',but it could use a bit more focus. It has a streak of 0")
                 //         else
                                // User Persistence: habits tracked
                                let speech = this.speechBuilder.addText("Have you completed 'Waking up early' today?")
                                this.followUpState('ProgressUpdateState').ask(speech);
                 let speech = this.speechBuilder.addText("Anything else I can help you with?")
                 this.followUpState('HelpOptionsState').ask(speech)
             }
              'Unhandled' : function(){
                  let speech = this.speechBuilder.addText("Not sure what you're telling me. You can choose "Add a habit", "List habits", "Remove a habit", or "Update my progress". If you'd like an explanation on these, say 'Help'. If you'd like to get going, say 'Goodbye'")
                  this.followUpState('HelpOptionsState').ask(speech)
          }
              'GoodbyeIntent' : function() {
                  let speech = this.speechBuilder.addText("Keep at it chief! See you soon.")
                  this.tell(speech)
              }

          }
           
      'ProgressUpdateState' : {
          'YesIntent' : function() {
              //Encouragement Line
              let speech = this.speechBuilder.addText("You're that much closer to your goals! I'll add a day to your streak. You're currently at " + streakNum + "days")
              habit1Count++
              // UpdateIntent +1
          }
          'NoIntent' : function() {
              // Encouragement Line (Havent completed habit yet
              let speech = this.speechBuilder.addText("If you're discouraged, think of the smallest step you could take toward completing this task, then do that")
              // UpdateIntent +1
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