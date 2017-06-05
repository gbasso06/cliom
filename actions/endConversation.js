'use strict';

// extract three elements od fequest directly
const endConversation = ({sessionId, context, entities}) => {

	return new Promise ((resolve, reject) => {
		console.log("--\nInside endConversation method");
		context.jobDone = true;
		return resolve(context);
	});
}

module.exports = endConversation;