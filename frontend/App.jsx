import { useState, useEffect } from 'react';
import { PersonEndpoint } from './generated/endpoints';
import '@vaadin/grid';
import '@vaadin/button';

function App() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const getPeople = async () => setPeople(await PersonEndpoint.findAll());
    getPeople();
  }, []);

  return (
    <div>
      <h1>React + Web Components + Vaadin Fusion</h1>
      <vaadin-grid items={people}>
        <vaadin-grid-column path="firstName" />
        <vaadin-grid-column path="lastName" />
        <vaadin-grid-column path="email" />
        <vaadin-grid-column path="dateOfBirth" />
      </vaadin-grid>
    </div>
  );
}

export default App;
