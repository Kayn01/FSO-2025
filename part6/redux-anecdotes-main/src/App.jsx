import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import NotificationMessage from './components/NotificationMessage'

const App = () => {
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