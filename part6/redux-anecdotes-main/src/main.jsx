import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

// const reducer = combineReducers({
//   anecdotes: anecdoteReducer,
//   filter: filterReducer,
// })


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
