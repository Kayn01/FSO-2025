import { useState, useEffect } from "react";
import weatherService from "../services/weather";

const Countries = ({ country, showDetails }) => {
  const [show, setShow] = useState(false);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (showDetails) {
      setShow(true);
    }
  }, [showDetails]);

  useEffect(() => {
    if (show && country.capital) {
      weatherService
        .getWeather(country.capital[0])
        .then((data) => setWeather(data))
        .catch((error) => {
          console.error("Failed to fetch weather:", error);
        });
    }
  }, [show, country.capital]);

  const languages = country.languages ? Object.values(country.languages) : [];

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <>
      {!showDetails && (
        <div>
          {country.name.common}
          <button onClick={toggleShow}>{show ? "Hide" : "Show"}</button>
        </div>
      )}

      {show && (
        <>
          <h2>{country.name.common}</h2>
          <div>
            <div>Capital: {country.capital}</div>
            <div>Area: {country.area}</div>
          </div>
          <div>
            <h3>Languages</h3>
            <ul>
              {languages.map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
          </div>
          <div>
            <img src={country.flags.png}></img>
          </div>

          {weather ? (
            <>
              <h3>Weather in {country.capital[0]}</h3>
              <div>Temperature: {weather.main.temp} °C</div>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <div>Wind: {weather.wind.speed} m/s</div>
            </>
          ) : (
            <div>Loading weather...</div>
          )}
        </>
      )}
    </>
  );
};

export default Countries;
