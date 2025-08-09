import { useState } from "react";
import { Button } from "./components/Button";

export function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <h1>Remote Application</h1>
      <Button />
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
