'uset strict';
const endConversation = require('./endConversation');

module.exports = (session, f) => {
	const actions = {

		// Wit drops in requests and repsonses objects
		send(request, response){
			const {sessionId, context, entities} = request;
			const {text, quickreplies} = response;

			console.log("--\nInside WIT Actions: Sending message to user");
			console.log("Request:\n" + JSON.stringify(request) +
						"\nResponse:\n" + response.text);

			return new Promise((resolve,reject) => {
				let {fbid} = session.get(sessionId);
				
				console.log("I got here with fbid:" + fbid);

				if(quickreplies){

					let buttons = quickreplies.map(title => {
						return {
							title,
							content_type: "text",
							payload: "null"
						}
					});

					f.quick(fbid, {
						text,
						buttons
					});

				} else {

					console.log("Its just text!");

					f.txt(fbid, text);

				}
				
				console.log("Exiting WIT Actions: Sending message to user\n--");

				return resolve();
			});
		},

		endConversation
	}

	return actions;
}