import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const filter = state.filter.toLowerCase()
    return [...state.anecdotes].filter((anecdote) => anecdote.content.toLowerCase().includes(filter))
    .sort((a, b) => b.votes - a.votes)
  });
  const dispatch = useDispatch();

  const vote = async (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(setNotification(`You voted for "${anecdote.content}"`, 5))
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
