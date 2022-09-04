const {MessageEmbed, Message } = require("discord.js");

/**
 * A class containing methods to deal with errors triggered on executing a command.
 * **Note all methods are static.**
 */
class ErrorHandler{

    /**
     * A function which responds to unexpected error i.e notifies the developer and the message author.
     * @static
     * @async
     * @param { Error } error 
     * @param { Message } message The message which invoked the error.
     */
    static async unexpectedErrorHandler(error, message){
        const emb = new MessageEmbed()
                    .setTitle("Error!")
                    .setColor("#fc3902")
                    .setDescription("```js\n" + `${error.stack}` + "```")
                    .addFields({
                        name : "Invocation:",
                        value : `${message.author.tag} used:\n\`\`\`\n${message.content}\`\`\`\n[Jump to message](${message.url})`
                    })
                    .setTimestamp();
                    
        const c = message.client;
        const auditLog = await c.channels.fetch("1015971677760397342");
        const spooky = await c.users.fetch("602935588018061453");
        const raj = await c.users.fetch("531548281793150987");
        auditLog.send({content:`${raj.toString()} ${spooky.toString()}`,embed:emb}); //${raj.toString()}

        message.reply("Something went wrong, The dev team has been notified. They'll get back to you soon!")
    }
}

module.exports = ErrorHandler;