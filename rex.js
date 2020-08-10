const tmi = require('tmi.js');
const config = require('./auth.json')

// Define configuration options
const opts = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: config.username,
    password: config.token
  },
  channels: config.channels
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect().catch(console.error);

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  if (msg.substring(0, 1) != '!') { return; }
  let args = msg.substring(1).trim().split(' ');
  const command = args[0];
  args = args.splice(1);
  if (command === 'dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${command} command`);
  } else {
    console.log(`* Unknown command ${command}`);
  }
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}
