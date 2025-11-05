import { useState, useEffect } from "react";

function useGestureRecognition(onGestureDetected) {
  const [points, setPoints] = useState([]);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event) => {
      setPoints([{ x: event.clientX, y: event.clientY }]);
      setDrawing(true);
    };

    const handlePointerMove = (event) => {
      if (drawing) {
        setPoints((prevPoints) => [...prevPoints, { x: event.clientX, y: event.clientY }]);
      }
    };

    const handlePointerUp = () => {
      setDrawing(false);

      // Analyze the points to detect a gesture
      const isGestureMatched = detectGesture(points);
      if (isGestureMatched) {
        onGestureDetected();
      }

      setPoints([]); // Reset points
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [onGestureDetected]);

  const detectGesture = (points) => {
    // Implement your gesture recognition logic here
    // For example, check if the points form an "S" shape
    return points.length > 10; // Placeholder condition
  };
}

export default useGestureRecognition;