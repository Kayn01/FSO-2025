import { createSlice } from '@reduxjs/toolkit'
import anecService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnec(state,action){
      const id = action.payload.id
      const anecdoteToChange = state.find(n => n.id === id)
      if(anecdoteToChange){
        anecdoteToChange.votes = action.payload.votes
      }
    },
    appendAnec(state, action){
      state.push(action.payload)
    },
    setAnecs(state, action){
      return action.payload
    }
  },
})

export const { voteAnec, appendAnec, setAnecs } = anecdoteSlice.actions

export const initializeAnecs = () => {
  return async dispatch => {
    const anecs = await anecService.getAll()
    dispatch(setAnecs(anecs))
  }
}

export const createAnec = content => {
  return async dispatch => {
    const newAnec = await anecService.createNew(content)
    dispatch(appendAnec(newAnec))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const returnedAnecdote = await anecService.update(anecdote.id, updatedAnecdote)
    dispatch(voteAnec(returnedAnecdote))
  }
}

export default anecdoteSlice.reducer
