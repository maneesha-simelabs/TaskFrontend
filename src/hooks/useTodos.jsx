import { useEffect, useState } from "react";
import { getTodos } from "../services/todoServices";
import { getErrorMessage } from "../utils/errorHandler";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      setLoading(true);

      const data = await getTodos();

      setTodos(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load todos."));
    } finally {
      setLoading(false);
    }
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
  };
}
