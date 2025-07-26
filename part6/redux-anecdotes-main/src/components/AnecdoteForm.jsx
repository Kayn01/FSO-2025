import { useDispatch } from "react-redux";
import { createAnec } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
import anecService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnec = async (event) => {
    event.preventDefault();
    const content = event.target.anec.value;
    event.target.anec.value = "";
    dispatch(createAnec(content))
    // const newAnec = await anecService.createNew(content)
    // dispatch(createAnec(newAnec));
    dispatch(setNotification(`you added "${content}`, 5))
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnec}>
        <div>
          <input name="anec" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
