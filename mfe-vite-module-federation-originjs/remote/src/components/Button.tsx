import "./Button.css";
import { useCount } from "../store";

export function Button() {
  const [state, setState] = useCount();

  return (
    <div>
      <button
        className="shared-btn"
        onClick={() => setState((previousState) => previousState + 1)}
      >
        Click me: {state}
      </button>
    </div>
  );
}
