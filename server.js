'use strict';
const config = require('./config');
// create an API server
const Restify = require('restify');
const server = Restify.createServer({
	name: 'CliomBot'
});
const PORT = process.env.PORT || 3000;

// FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config.FB);

server.use(Restify.jsonp());
server.use(Restify.bodyParser());
server.use((req, res, next) => f.verifySignature(req, res, next));

// Session module
const session = require('./session');

// WIT Actions
const actions = require('./actions')(session, f);

// WIT.AI
const Wit = require('node-wit').Wit;
const wit = new Wit({
	accessToken: config.WIT_ACCESS_TOKEN,
	actions
});

// Register the webhooks
server.get('/', (req, res, next) => {
	f.registerHook(req, res);
	return next();
});


var utf8 = require('utf8');

// Handle incoming
server.post('/', (req, res, next) => {

	//console.log(next);

	f.incoming(req, res, msg => {


			// Log msg object
			console.log("-----------------------------------------------\nMessage received... Start processing\n");// + JSON.stringify(msg));

			const {
				sender,
				postback,
				message
			} = msg;


			if(message.text) {


				//utf8.enconde(message.text);
				console.log("message text:" + JSON.stringify(message.text));
				// Process the message here
				let sessionId = session.init(sender);
				let {context} = session.get(sessionId);

				// Run WIT API (Converse API)
				wit.runActions(sessionId, message.text, context)
					.then(ctx =>{
						// Delete the session if the conversation is over

						console.log(`Devo concluir tarefa:`+ JSON.stringify(ctx));
						ctx.jobDone ? session.delete(sessionId) : session.update(sessionId, ctx);

						
					})
					.catch(error => console.log(`Error: ${error}`));
			
			// else{
			// 	f.txt(sender, "Desculpe não entendi");
			// }
			}
	});

	console.log("--\ncalling next...\n" + JSON.stringify(next));

	return next();
});

// Subscribe
f.subscribe();

server.listen(PORT, () => console.log(`Bot running on port ${PORT}`));

