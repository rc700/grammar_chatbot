// dependencies

var restify = require('restify');

var builder = require('botbuilder');

var request = require('request');

var natural = require('natural');

// Setup Restify Server

var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {

   console.log('%s listening to %s', server.name, server.url); 

});

// Create chat connector for communicating with the Bot Framework Service

var connector = new builder.ChatConnector({

    appId: process.env.MICROSOFT_APP_ID,

    appPassword: process.env.MICROSOFT_APP_PASSWORD

});

// create the bot

var bot = new builder.UniversalBot(connector);

// Listen for messages from users 

server.post('/GrammarGuru', connector.listen());

//entry point for branches and receving an image

var bot = new builder.UniversalBot(connector, function(session){

    var msg = "I am the grammar guru. I can check spelling (spell), phonetics (phonetics) and inflection (inflection).";
    session.send(msg)

});

bot.dialog('spell', [

    function (session) {

        builder.Prompts.text(session, "I can check a few words")

    },

    function (session, results) {
        session.dialogData.wordInput = results.response;

        var corpus = ['good', 'something', 'dark', 'side', 'unlimited', 'power', 'I', 'am', 'the', 'senate']
        var spellCheck = new natural.Spellcheck(corpus)

        result = spellCheck.isCorrect(session.dialogData.wordInput);

        if(result){
            session.endDialog('good spelling!')
        } else {
            session.endDialog('The closest spelling is ==> ' + spellCheck.getCorrections(session.dialogData.wordInput, 1));
        }
    }

]).triggerAction({

    matches: /^spell$/i

});

bot.dialog('phonetics', [

    function (session) {

        builder.Prompts.text(session, "I can tell you if words sound the same. Enter a word.")

    },

    function (session, results) {
        session.dialogData.wordA = results.response;
        
        builder.Prompts.text(session, 'Enter the second word');
    }, 
    
    function(session, results){
        session.dialogData.wordB = results.response;
        var metaphone = natural.Metaphone;
        if(metaphone.compare(session.dialogData.wordA, session.dialogData.wordB)){
            session.endDialog('These words are phonetically similar')
        } else {
            session.endDialog('These words are not phonetically similar')
        }

    }


]).triggerAction({

    matches: /^phonetics$/i

});