const Discord = require('discord.js');
const Beautify = require('js-beautify').js_beautify;

const client = new Discord.Client();
const cleanCodeExp = new RegExp(/([`]{3})clean-code([^```]*)([`]{3})/g);
const beautifyOptions = require("./jsbeautify.json");

var auth;
try {
	auth = require("./auth.json");
} catch (e){
	console.log("No auth.json found. Please see auth.example.json.\n"+e.stack);
	process.exit();
}

client.on('ready', () => {
  console.log('Client connected.');
});

// Everytime a message is seen
client.on('message', message => {

  // Test for the correct code block
  if ((cleanCodeExp.test(message.content)) && (message.author.bot === false)) {

    // Delete the old message
    message.delete()
      .then(msg => console.log(`Deleted message from ${msg.author}`))
      .catch(console.error);

    // Set up a response string
    var res = message.author + `, here is your message with formatted code:\n${message.content}`;

    // Fetch the code block contents
    var code = message.content.match(cleanCodeExp);

    // Loop through the matches
    for (var i = 0; i < code.length; i++) {
      // Replace all code with pretty code
      var rawCode = code[i].substr(13,code[i].length - 16);
      var originalCode = rawCode;
      var prettyCode = Beautify(originalCode, beautifyOptions);
      res = res.replace(originalCode, prettyCode);
    }

    // Replace the language with javascript
    res = res.replace(/(clean-code)/g, 'javascript\n');

    // Send it to the channel!
    message.channel.sendMessage(res)
      .then(message => console.log(`Sent message: ${message.content}`))
      .catch(console.error);
  }
});

// Login
client.login(auth.token);
