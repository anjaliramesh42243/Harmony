'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

//this.$user.$data.habitArray = [];
//var habitCountArray = [];
var habitArray = ["banana", "apple"];

let addedHabit = '';
let myTime = ''
let returningUser = 0;
let habitCounter = 0;
let reminders = 0;
let i = 0;

//launch intents for user's first time through and consecutive times through
app.setHandler({
   LAUNCH() {
       if (returningUser == 0) {
         this.toIntent('LaunchIntent');
       }
       else if (returningUser != 0) {
         this.toIntent('LaunchIntent2');
       }
    },

    LaunchIntent() {
        let speech = this.speechBuilder().addText("Hey there! My name’s Harmony. I understand you’re just checking me out, so no pressure. I'm here to help you build healthier habits to level up your life.  Do you think you could use help building healthier habits?");
        this.followUpState('WantHelpState').ask(speech);
        habitCounter = 0;
    },

        'WantHelpState' : {
            'YesIntent' : function() {
               let speech = this.speechBuilder().addText("Awesome!  Look at you taking initiative already!  Well, as you have probably heard, it only takes 21 days to build a new healthy habit.  So are you ready to get started?");
               this.followUpState('GettingStartedState').ask(speech);
            },

            'NoIntent'  : function() {
               this.tell("No problem. I'll be here whenever you're ready to tell me about your goals.");
            },

            'Unhandled' : function() {
                let speech = this.speechBuilder().addText("Sorry, I'm new to this and still learning. Could you repeat with yes or no?");
                this.followUpState('WantHelpState').ask(speech);
            }
        },
        
        'GettingStartedState' : {
           'YesIntent' : function() {
               let speech = this.speechBuilder().addText("Ok, cool.  So let me tell you how this works.  It's as easy as 1, 2, 3. First, you can add a new habit and I'll keep track of how many days in a row you've completed that habit. Second, I'll remind you every day with a notification.  That is a reminder for you to update me on your progress.  I'll be there cheering you on every step of the way! And finally, I can give you a progress update anytime you want.  And don't worry, if your goals change later on you can always remove a habit.  So what do you think, would you like to hear a few of my favorite habits to track?");
               this.followUpState('HearAboutHabitState').ask(speech);
            },
               
           'NoIntent' : function() {
               this.tell("No problem. I'll be here whenever you're ready to tell me about your goals.");
            },
               
           'Unhandled' : function() {
               let speech = this.speechBuilder().addText("Sorry, I'm new to this and still learning. Could you repeat with yes or no?");
               this.followUpState('GettingStartedState').ask(speech);
           }
                   
           
        },
        
    //allows user to either choose pre-written categories or continue on to adding their own habit
        'HearAboutHabitState' : {
           'YesIntent' : function() {
               let speech = this.speechBuilder().addText("Love the energy! I'm happy to help you with your new journey. I have suggestions for the categories Happiness, Health, and Wealth. Which would you like to hear about?");
               this.followUpState('ChooseCategoryState').ask(speech);
           },
           
           'NoIntent' : function() {
               let speech = this.speechBuilder().addText("You got it! Would you like to give me a habit to start tracking?");
               this.followUpState('TrackingHabitState').ask(speech);
           },
           
           'Unhandled' : function() {
           let speech = this.speechBuilder().addText("The areas you can choose from are Happiness, Health, or Wealth. Or you can say none to move on.");
           this.followUpState('ChooseCategoryState').ask(speech);
           }
        },
        
    //three different categories that user can choose to go through/hear
          'ChooseCategoryState' : {
            'HappinessIntent' : function() {
               let speech = this.speechBuilder().addText("Studies show that we can improve our daily happiness by practicing gratitude! Setting some time aside every day to think about what you're grateful for can promote a positive outlook on life no matter your current circumstance. Would you like to hear another suggestion?");
               this.followUpState('WhichAreaState').ask(speech);
            },
            
            'HealthIntent' : function() {
               let speech = this.speechBuilder().addText("Studies show daily activity can help you sleep better, prevent chronic illness, and increase energy levels. It doesn't have to be long or strenuous, but consistency in your exercise routine should be the main goal. Would you like to hear another suggestion?");
               this.followUpState('WhichAreaState').ask(speech);
            },
            
            'WealthIntent' : function() {
               let speech = this.speechBuilder().addText("Being intentional about your money allows you to enable self-control, delaying immediate satisfaction that can positively affect many other aspects of your life. Make a budget that allows for consistent saving, and check in with me every day you stuck to your budget. Would you like to hear another suggestion?");
               this.followUpState('WhichAreaState').ask(speech);
            },
            
            'Unhandled' : function() {
               let speech = this.speechBuilder().addText("The areas you can choose from are Happiness, Health, or Wealth. Or you can say none to move on.");
               this.followUpState('ChooseCategoryState').ask(speech);
            },
            
            'NoneIntent' : function() {
               let speech = this.speechBuilder().addText("You got it! Would you like to give me a habit to start tracking?");
               this.followUpState('TrackingHabitState').ask(speech);
            },
            
            'NoIntent' : function() {
               let speech = this.speechBuilder().addText("You got it! Would you like to give me a habit to start tracking?");
               this.followUpState('TrackingHabitState').ask(speech);
            }
               
        },
        
         'WhichAreaState' : {
            'YesIntent' : function() {
               let speech = this.speechBuilder().addText("Ok, sure. In which area?");
               this.followUpState('ChooseCategoryState').ask(speech);
               },
               
            'NoIntent' : function() {
               let speech = this.speechBuilder().addText("You got it! Would you like to give me a habit to start tracking?");
               this.followUpState('TrackingHabitState').ask(speech);
               },
               
            'Unhandled' : function() {
               let speech = this.speechBuilder().addText("Sorry, I'm new to this and still learning. Could you repeat with yes or no?");
               this.followUpState('WhichAreaState').ask(speech);
               }
        },
        
        
        'TrackingHabitState' : {
            'YesIntent' : function() {
                let speech = this.speechBuilder().addText("Great! Say add and then your habit. What habit would you like to add?");
                this.followUpState('AddHabitsState').ask(speech);
            },
               
            'NoIntent' : function() {
                if (habitCounter == 0) {
                    let speech = this.speechBuilder().addText("That's ok! You can always add a new habit later. I look forward to hearing about your goals when you're ready.");
                    this.tell(speech);
                }
                else if (habitCounter >= 1 && reminders == 0) {
                    let speech = this.speechBuilder().addText("Ok! If you think of anything else, just say 'I'd like to add a habit'. Would you like to set up daily reminders for your " + habitCounter + " habits?");
                    this.followUpState('RemindersState').ask(speech);
                }
                else if (habitCounter >= 1 && reminders == 1) {
                    let speech = this.speechBuilder().addText("No problem! Just don't forget about me and let me know when you accomplish tasks. I'm always excited to hear about your progress!");
                    this.tell(speech);
                }
                },
                    
               
            'Unhandled' : function() {
               let speech = this.speechBuilder().addText("Sorry, I'm new to this and still learning. Could you repeat with yes or no?");
               this.followUpState('TrackingHabitState').ask(speech);
               }
        },
        
        //takes in habit from user and adds it to an array for later use
         'AddHabitsState' : {
            'AddHabitIntent' : function(myHabit) {
               addedHabit = this.$inputs.myHabit.value;
               let speech = this.speechBuilder().addText("That's what I'm talking about! ", "Healthy habits lead to a healthy life without even thinking about it. ", "You're on a roll dude! ", "Another day, another habit being formed. ", "Way to bring it today! " )
               speech = speech + this.speechBuilder().addText("I'll add " + addedHabit + " to your board. Would you like to add another habit to your board?");             
              //this.$user.$data.habitArray[i] = (addedHabit);
              //i++;
              
              //updates habit counter, changes user status to returning so that next run through is different
               habitCounter += 1;
               returningUser = 1; 
               this.followUpState('TrackingHabitState').ask(speech);
               },
        
              
            'Unhandled' : function() {
                  let speech = this.speechBuilder().addText("Sorry, could you repeat your habit? Remember to say add before saying your habit.");
                  this.followUpState('AddHabitsState').ask(speech);
              }
        },
        
        //lets user choose a specific time to be reminded of their habits
         'RemindersState' : {
            'YesIntent' : function() {
               let speech = this.speechBuilder().addText("Will do! To choose a time, just say 'remind me at' and then your preferred time. When would you like to be reminded?");
               this.followUpState('ReminderTimeState').ask(speech);
               },
               
            'NoIntent' : function() {
               let speech = this.speechBuilder().addText("No problem! If you decide later you want to turn them on, just say 'Start reminding me of my habits.' Just don't forget about me and let me know when you accomplish tasks. I'm always excited to hear about your progress!");
               this.tell(speech);
               }
         },
            
        'ReminderTimeState' : {
            
            //uses the chosen time to remind user of whichever habit
            'RemindTimeIntent' : function(timeInput) {
                myTime = this.$inputs.timeInput.value;
                reminders = 1;
                let speech = this.speechBuilder().addText("Sounds good! I'll remind you of your habit(s) at " + myTime + " . Would you like to add another habit to your board?");
                this.followUpState('TrackingHabitState').ask(speech);
                
            },
            
            'Unhandled' : function() {
                let speech = this.speechBuilder().addText("Sorry, I'm new to this and still learning. Could you give me a time to remind you?");
                this.followUpState('ReminderTimeState').ask(speech);
            }
        },
        
       
             
         
    //When the user returns to the app for the second time after first run through              
    LaunchIntent2() {
        let speech = this.speechBuilder().addText("Hey fam! Harmony here! Welcome back. Just letting you know you still have time to complete your habits for the day. What would you like to do? For a reminder of what I can help you with, just say, Help.");
        this.followUpState('HelpOptionsState').ask(speech);
        
    },
    
    //Lists what actions Harmony can now do to help the user remember their options
    
    'HelpOptionsState' : {
              'HelpIntent' : function() {
                  let speech = this.speechBuilder().addText("You can say 'List my habits' to hear what habits I have been tracking so far, 'Add a habit' to start tracking a new habit, 'Remove a habit' to stop tracking a habit, or 'Update my progress' to let me know which habits you've completed today");
                  this.followUpState('HelpOptionsState').ask(speech);
             },
         
              //lists the habits that are currently being tracked
              'ListIntent' : function() {
                  if (this.$user.$data.habitArray.length > 0)
                  {
                      this.tell("We are currently tracking "+ habitCounter + "habits:"); 
                      for( i = 0; i < this.$user.$data.habitArray.length; i++)
                      {
                          this.tell(this.$user.$data.habitArray[i]);
                      }
                      let speech = this.speechBuilder().addText("What else can I help you with?");
                  }
                  else {
                     this.tell("So far I am not tracking any habits for you. You can say 'Add a habit' to start a new journey with me.")
                  }
                  this.followUpState('HelpOptionsState');
             },
             
             //Allows the user to add a habit
             'AddIntent' : function() {
                 if(habitCounter == 2)
                 {
                     let speech = this.speechBuilder.addText("To add another habit, you can say 'Purchase Unlimited Habits'. For $0.99, I can track unlimited habits for you. If not, just say 'No Thanks'")
                     this.tell(speech);
                     //this.followUpState('PurchaseState').ask(speech)
                 }
                 else
                 {
                 let speech = this.speechBuilder.addText("That's what I'm talking about!", "You're on a roll dude!", "Another day, another habit being formed", "Way to bring it today!");
                 speech = speech + this.speechBuilder.addText("What habit would you like to add?");
                 
                 //habitAdded = this.$inputs.data.habitAdded
                 //this.$user.$data.habitArray.push(habitAdded)
                 //let speech = this.speechBuilder.addText("This is the start of another healthy journey. I'll add " + habitAdded + "to your habit board. Anything else I can help you with?")
                 //this.followUpState('AddHabitsState').ask(speech);
                 }
             },
   
        
        //the following intents only work to a certain extent, and crash when there is more than one run through
        
        //
        
        //
              /*'RemoveIntent' : function() {
                 // Encouragement Line (removing habit specific)
                 if (habitCountArray.length > 0)
                 {
                     let speech = this.speechBuilder.addText("Which habit on your board would you like to remove?")
                     let habitRemoved = this.$input.data.habitRemoved
                     bool found = false
                     for (int i = 0; i < habitArray.length; i++) 
                     {
                        if (habitArray[i] == habitRemoved)
                        {
                             habitArray.splice(index, i)
                             habitCountArray.splice(index, i)
                             found = true
                        }
                     }
                    if (found)
                        let speech = this.speechBuilder.addText("No worries! You can find different ways to be healthy.", "Producitivity doesn't always equal happiness", "We'll find something that gives you more satisfaction in the future!")
                        let speech = this.speechBuilder.addText("I removed " + habitRemoved + " from your habit board. Would you like help with anything else?")
                    else
                    {
                         let speech = this.speechBuilder.addText("I did not find that habit. Would you like to try again?")
                         this.followUpState('TryResponseState').ask(speech)
                         //   if yes, loop through. if no, exit out
                         //   not sure how to either compare a user variable to 'yes' or to go from separate state/ intent then jump 
                         //     back into the found loop
                         //
                         // maybe ask user "to try again, say you'd like to remove a habit" then go back to the top of RemoveIntent
                         
                     }        
                  }
                  else if (habitCountArray.length == 0)
                        let speech = this.speechBuilder.addText("I'm currently not tracking any habits to remove. Is there anything else you need help with?") 
                        
                  this.followUpState('HelpOptionsState').ask(speech)
             }
              'UpdateIntent' : function() {
                let speech = this.speechBuilder.addText("Of course!")
                 if (habitCountArray.length == 0)
                      let speech = this.speechBuilder.addText("I'm currently not tracking any habits that I can update. You can say 'Add a habit' to start a tracking your progress")
                 else if (habitCount >= 1)
                 { 
                      for(int i = 0; i < habitArray.length; i++)
                      {
                             if (date > prevDate+1)
                             {
                                let speech = this.speechBuilder.addText("Heads Up! Your streak for" + habitArray[i] + "has been reset to zero because a day was missed.")
                                if (streakSaverCount > 0)
                                {
                                    let speech = this.speechBuilder.addText("Would you like to use a streak saver on this habit?")
                                    this.followUpState('StreakSaverState')
                                }
                            let speech = this.speechBuilder.addText("Have you completed " + habitArray[i] +" today?")
                            this.followUpState('ProgressUpdateState').ask(speech);
                      }
                 }
                 let speech = this.speechBuilder.addText("In case you need it, you can purchase a streak saver for 50 cents to start your streak where you left off if you missed a day. Just tell me you'd like to buy a streak saver.")
                 let speech = this.speechBuilder.addText("Anything else I can help you with?")
                 this.followUpState('HelpOptionsState').ask(speech)
             }
              'Unhandled' : function(){
                  let speech = this.speechBuilder.addText("Sorry, I'm still learning. You can choose "Add a habit", "List habits", "Remove a habit", or "Update my progress". If you'd like an explanation on these, say 'Help'. If you'd like to get going, say 'Goodbye'")
                  this.followUpState('HelpOptionsState').ask(speech)
          }
              'GoodbyeIntent' : function() {
                  let speech = this.speechBuilder.addText("Keep at it chief! See you soon.")
                  this.tell(speech)
              }

          }
        
      'BuyUnlimitedIntent' : function() {

      }
      'BuySaversIntent' : function() {  
         streakSaverCount++;
      }
      'NoIntent' : function() {
          let speech = this.speechBuilder.addText("No problem! What else can I help you with?")
          this.followUpState('HelpOptionsState').ask(speech)
          
        } 
      'ProgressUpdateState' : {
          'YesIntent' : function() {
              //Encouragement Line
              habitCountArray[i]++;
              let speech = this.speechBuilder.addText("You're that much closer to your goals! I'll add a day to your streak. You're currently at " + habitCountArray[i] + "days")
          }
          'NoIntent' : function() {
              // Encouragement Line (Havent completed habit yet
              let speech = this.speechBuilder.addText("If you're feeling discouraged, think of the smallest step you could take toward completing this task, then do that")
              let speech = this.speechBuilder.addText("Your streak is currently at " + habitCountArray[i] + "days")
              // UpdateIntent +1
          }
          
      'TryResponseState' : {
          'YesIntent' : function() {
              return this.toStateIntent(HelpOptionsState, RemoveIntent);
          }
          'NoIntent' : function() {
              let speech = this.speechBuilder.addText("No problem! What else can I help you with?")
              this.followUpState('HelpOptionsState').ask(speech)
          }
          
      'StreakSaverState' : {
          'YesIntent' : function() {
              let speech = this.speechBuilder.addText("Sounds good! Your streak has been revived to " + habitCountArray[i])
              
          }
          'NoIntent' : function() {
              habitCountArray[i] = 0
              let speech = this.speechBuilder.addText("No problem. You'll be able to build it back up in no time!")     
          }
      }
      
        },    */ 
       
        
});

module.exports.app = app;
