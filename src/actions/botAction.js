import { UPDATE_BOT } from '../constants'

export const updateBot = (bot) => dispatch => {
	dispatch({
		type: UPDATE_BOT,
		payload: {
			bot
		}
	})
}