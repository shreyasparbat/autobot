// Library imports
import React from 'react'
import ReactDOM from 'react-dom'
import 'typeface-roboto'
import { Provider } from 'react-redux'
import store from './store';

// Component imports
import App from './components/App'

// Render the App
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById('root')
)
