import { useEffect } from "react";

function useShakeDetection(onShake) {
  useEffect(() => {
    let lastX = null, lastY = null, lastZ = null;
    let shakeCount = 0;

    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        if (deltaX > 15 || deltaY > 15 || deltaZ > 15) {
          shakeCount++;
          if (shakeCount >= 2) {
            onShake(); // Trigger the callback when a shake is detected
            shakeCount = 0; // Reset shake count
          }
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleMotion);
    } else {
      console.log("DeviceMotionEvent not supported");
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [onShake]);
}

export default useShakeDetection;