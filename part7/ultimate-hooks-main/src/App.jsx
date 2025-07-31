import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification, clearNotification } from './reducers/notificationReducer'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl)
      .then(response => {
        setResources(response.data)
      })
      .catch(error => {
        console.error('Error fetching resources:', error)
      })
  }, [baseUrl])

  const create = async (resource) => {
    try{
      const response = await axios.post(baseUrl, resource)
      setResources(resources.concat(response.data))
      return response.data
    }catch(error){
      console.error('Error creating resource:', error)
      throw error
    }
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if(!notification){
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    marginBottom: 10, 
    backgroundColor: 'lightgreen'
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const dispatch = useDispatch()

  const handleNoteSubmit = async (event) => {
    event.preventDefault()
    try {
      await noteService.create({ content: value })
      dispatch(setNotification(`a new note '${content.value}' created`, 5))
      content.onChange({ target: {value: ''}})
    }catch(error){
      dispatch(setNotification('Error creating note', 5))
    }
  }
 
  const handlePersonSubmit = async (event) => {
    event.preventDefault()
    try {
      await personService.create({ name: name.value, number: number.value})
      dispatch(setNotification(`a new person '${name.value}' added`, 5))
      name.onChange({ target: { value: '' }})
      number.onChange({ target: { value: '' }})
    }catch(error){
      dispatch(setNotification('Error adding person', 5))
    }
  }

  return (
    <div>
      <Notification/>
      
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App