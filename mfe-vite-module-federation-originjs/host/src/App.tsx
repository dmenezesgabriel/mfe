import { Button } from "remoteApp/Button";
import { useCount } from "remoteApp/store";

export function App() {
  const [count, setCount] = useCount();

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
