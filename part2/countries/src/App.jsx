import { useState, useEffect } from "react";
import Service from "./services/countries";
import Countries from "./components/Countries";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [countries, setCountries] = useState([]);

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const searchSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    Service.getAll().then((initialCountries) => {
      const filtered = initialCountries.filter((c) =>
        c.name.common.toLowerCase().includes(searchValue.toLowerCase())
      );

      if (filtered.length > 10) {
        setCountries(null);
      } else {
        setCountries(filtered);
      }
    });
  }, [searchValue]);

  return (
    <>
      <form onSubmit={searchSubmit}>
        find countries &nbsp;
        <input type="text" value={searchValue} onChange={handleSearch} />
      </form>

      {countries === null && searchValue.length > 0 ? (
        <div>Too many matches, specify another filter</div>
      ) : countries === null ? (
        <div></div>
      ) : countries.length === 1 ? (
        <Countries country={countries[0]} showDetails={true} />
      ) : (
        countries.map((c) => (
          <Countries key={c.cca3} country={c} showDetails={false} />
        ))
      )}
    </>
  );
}

export default App;
