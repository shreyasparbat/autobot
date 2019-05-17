import { UPDATE_BOT } from '../constants.js'

let initialState = {
	bot: {
		events:[],
		variables:[],
		childEvents:[]
	}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_BOT:
			return {
				...state,
				bot: action.payload.bot
			}
		default:
			return state
		}
}