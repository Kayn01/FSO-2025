import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import NotificationMessage from './components/NotificationMessage'
import anecService from './services/anecdotes'
import { setAnecs } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    anecService
      .getAll().then(anec => dispatch(setAnecs(anec)))
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