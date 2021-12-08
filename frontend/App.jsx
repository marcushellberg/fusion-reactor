import { useState } from 'react';
import '@vaadin/button';

function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <div>
      <vaadin-button onClick={increment}>Hello</vaadin-button>
      <span>The count is {count} </span>
    </div>
  );
}

export default App;
