import { useSelector, useDispatch } from 'react-redux'

const generateId = () => 
  Number((Math.random() * 1000000).toFixed(0))

const App = () => {
  const anecdotes = useSelector(state => state).sort((a, b) => b.votes - a.votes)
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch({ type: 'VOTE', data: { id }})
  }

  const addAnec = (event) => {
    event.preventDefault()
    const content = event.target.anec.value
    event.target.anec.value = ''
    dispatch({
      type: 'NEW_ANEC',
      payload: {
        content,
        id: generateId(),
        votes : 0
      }
    })
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addAnec}>
        <div><input name='anec'/></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default App