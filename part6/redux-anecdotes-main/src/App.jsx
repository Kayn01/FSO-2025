import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import NotificationMessage from './components/NotificationMessage'
import { useDispatch } from 'react-redux'
import { initializeAnecs } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecs())
  }, [])
  return (
    <div>
      <h2>Anecdotes</h2>
      <NotificationMessage />
      <br/>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App