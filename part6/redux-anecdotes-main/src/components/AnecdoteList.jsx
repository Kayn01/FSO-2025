import { useDispatch, useSelector } from "react-redux";
import { voteAnec } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const filter = state.filter.toLowerCase()
    return [...state.anecdotes].filter((anecdote) => anecdote.content.toLowerCase().includes(filter))
    .sort((a, b) => b.votes - a.votes)
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteAnec(id));
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
