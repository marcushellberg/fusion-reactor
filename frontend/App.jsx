import { useState } from 'react';
import { PersonEndpoint } from './generated/endpoints';
import '@vaadin/grid';
import '@vaadin/button';

function App() {
  const [people, setPeople] = useState([]);
  const fetchData = async () => setPeople(await PersonEndpoint.findAll());

  return (
    <div>
      <h1>React + Web Components + Vaadin Fusion</h1>
      <vaadin-button onClick={fetchData}>Fetch data</vaadin-button>
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
