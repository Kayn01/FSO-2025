const Persons = (props) => {
  return (
    <>
      {props.persons.map((p) => {
        return (
          <div key={p.id}>
            {p.name} {p.number}
            <button onClick={() => props.onClick(p.id)}>delete</button>
          </div>
        );
      })}
    </>
  );
};

export default Persons;
