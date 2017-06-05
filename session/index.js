'use strict';
const {findById} = require('../utils');
const crypto = require('crypto');
const sessionStore = new Map();
const session = {
	init (id) {

		let sessionId = findById(id, sessionStore);
		if(sessionId) return sessionId;
		else{

			// instantiate a new sessionId
			// sessionId, context objects
			let newSessionId = crypto.randomBytes(12).toString('hex');
			let obj = {
				fbid: id,
				context: {}
			}

			sessionStore.set(newSessionId, obj);
			return newSessionId;
		}
	},

	get(sessionId) {

		// sessionStore is private to session module and should now provide
		// access to the store itself. Thats why get method is just a wraper

		return sessionStore.get(sessionId);
	},

	update(sessionId, context) {
		
		let obj = sessionStore.get(sessionId);

		console.log("--\nUpdating context...\nobj:"+ JSON.stringify(obj) + 
					"\ncontext:" + JSON.stringify(obj.context) + 
					"\nnext context:" + JSON.stringify(context));

		obj.context = context;
		
		console.log("\nContext updated!\nnew object:"+ JSON.stringify(obj) +
					"\nnew context:" + JSON.stringify(obj.context));

		return sessionStore.set(sessionId, obj);
	},

	delete(sessionId){
		sessionStore.delete(sessionId);
		console.log("--\nsession has been deleted");
		return;
	} 
}

module.exports = session;