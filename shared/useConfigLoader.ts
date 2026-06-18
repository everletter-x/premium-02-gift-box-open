import { useState, useEffect } from "react";

export function useConfigLoader<T>(path: string) {
  const [config, setConfig] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(path)
      .then((r) => r.json())
      .then((d) => {
        setConfig(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, [path]);

  return { config, loading, error };
}
