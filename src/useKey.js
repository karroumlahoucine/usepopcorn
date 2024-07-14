import { useEffect } from "react";

export function useKey(code, action) {
  useEffect(() => {
    function escape(e) {
      if (e.code.toLowerCase() === code.toLowerCase()) {
        action();
      }
    }
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("keydown", escape);
    };
  }, [code, action]);
}
