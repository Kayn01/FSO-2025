import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Service from "./services/notes";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filterName, setFilterName] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Service.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  });

  const addPerson = (event) => {
    event.preventDefault();

    const duplicate = persons.some((person) => person.name === newName);

    if (duplicate) {
      const updatedPerson = persons.find((n) => n.name === newName);
      const changedPerson = { ...updatedPerson, number: newPhone };

      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        Service.update(updatedPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== updatedPerson.id ? p : returnedPerson
              )
            );
            setMessage(`Updated ${newName}'s number`);
            setTimeout(() => setMessage(null), 5000);
          })
          .catch((error) => {
            setError(
              `Information of ${newName} has already been removed from the server`
            );
            setPersons(persons.filter((p) => p.id !== updatedPerson.id));
            setTimeout(() => setError(null), 5000);
          });

        setNewName("");
        setNewPhone("");
      }
      return;
    }

    const newPerson = { name: newName, number: newPhone };

    Service.create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setMessage(`Added ${newPerson.name}`);
        setTimeout(() => setMessage(null), 5000);
        setNewName("");
        setNewPhone("");
      })
      .catch((error) => {
        setError(`Failed to add ${newPerson.name}`);
        setTimeout(() => setError(null), 5000);
      });
  };

  const deletePerson = (id) => {
    const deletedPersons = persons.find((person) => person.id === id);
    if (confirm(`Delete ${deletedPersons.name}?`)) {
      Service.deleteP(id);
    }
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={error} type={"err"} />
      <Notification message={message} type={"success"} />
      <Filter value={filterName} onChange={handleFilterName} />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        valueName={newName}
        onChangeName={handleNameChange}
        valuePhone={newPhone}
        onChangePhone={handlePhoneChange}
      />

      <h2>Numbers</h2>
      <Persons
        persons={persons.filter((p) =>
          p.name.toLowerCase().includes(filterName.toLowerCase())
        )}
        onClick={deletePerson}
      />
    </div>
  );
};

export default App;
