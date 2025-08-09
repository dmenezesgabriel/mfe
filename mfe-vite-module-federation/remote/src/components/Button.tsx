import { useState } from "react";

export function Button() {
  const [state, setState] = useState<number>(0);

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
