module.exports = {
  name: "beep",
  description: "Beep!",
  execute(message) {
    message.channel.send("Hi! <3");
  },
};
