import { useState } from "react";

import { Button } from "remoteApp/Button";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Host Application</h1>
      <div>
        <Button />
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
