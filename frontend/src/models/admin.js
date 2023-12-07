/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useState, useCallback } from 'react';

export default () => {
  const [counter, setCounter] = useState(0);
  const increment = useCallback(() => {
    setCounter((c) => c + 1);
    console.log('Counter ===>', counter);
  });
  const decrement = useCallback(() => setCounter((c) => c - 1), []);
  return { counter, increment, decrement };
};
