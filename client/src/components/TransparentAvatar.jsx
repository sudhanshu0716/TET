import React, { useEffect, useState, useRef } from 'react';

const TransparentAvatar = ({ src, alt, className, tolerance = 40 }) => {
  const [processedSrc, setProcessedSrc] = useState(src);
  const cache = useRef({});

  useEffect(() => {
    if (!src) return;
    if (cache.current[src]) {
      setProcessedSrc(cache.current[src]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setProcessedSrc(src);
          return;
        }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        const totalPixels = width * height;

        // Helper to check if pixel is near black
        const isTarget = (r, g, b) => {
          return r < tolerance && g < tolerance && b < tolerance;
        };

        const visited = new Uint8Array(totalPixels);
        const queueX = new Int32Array(totalPixels);
        const queueY = new Int32Array(totalPixels);
        let head = 0;
        let tail = 0;

        // Add boundary pixels as starting points
        // Top and bottom rows
        for (let x = 0; x < width; x++) {
          const topIdx = x;
          visited[topIdx] = 1;
          queueX[tail] = x;
          queueY[tail] = 0;
          tail++;

          const botIdx = (height - 1) * width + x;
          visited[botIdx] = 1;
          queueX[tail] = x;
          queueY[tail] = height - 1;
          tail++;
        }
        // Left and right columns (excluding corners already covered)
        for (let y = 1; y < height - 1; y++) {
          const leftIdx = y * width;
          visited[leftIdx] = 1;
          queueX[tail] = 0;
          queueY[tail] = y;
          tail++;

          const rightIdx = y * width + (width - 1);
          visited[rightIdx] = 1;
          queueX[tail] = width - 1;
          queueY[tail] = y;
          tail++;
        }

        // BFS to find all background pixels
        while (head < tail) {
          const cx = queueX[head];
          const cy = queueY[head];
          head++;

          const currIdx = cy * width + cx;
          const dataIdx = currIdx * 4;
          const r = data[dataIdx];
          const g = data[dataIdx + 1];
          const b = data[dataIdx + 2];

          if (isTarget(r, g, b)) {
            // Make transparent
            data[dataIdx + 3] = 0;

            // Check 4-neighbors
            // Right neighbor
            if (cx + 1 < width) {
              const nIdx = currIdx + 1;
              if (!visited[nIdx]) {
                visited[nIdx] = 1;
                queueX[tail] = cx + 1;
                queueY[tail] = cy;
                tail++;
              }
            }
            // Left neighbor
            if (cx - 1 >= 0) {
              const nIdx = currIdx - 1;
              if (!visited[nIdx]) {
                visited[nIdx] = 1;
                queueX[tail] = cx - 1;
                queueY[tail] = cy;
                tail++;
              }
            }
            // Bottom neighbor
            if (cy + 1 < height) {
              const nIdx = currIdx + width;
              if (!visited[nIdx]) {
                visited[nIdx] = 1;
                queueX[tail] = cx;
                queueY[tail] = cy + 1;
                tail++;
              }
            }
            // Top neighbor
            if (cy - 1 >= 0) {
              const nIdx = currIdx - width;
              if (!visited[nIdx]) {
                visited[nIdx] = 1;
                queueX[tail] = cx;
                queueY[tail] = cy - 1;
                tail++;
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL();
        cache.current[src] = dataUrl;
        setProcessedSrc(dataUrl);
      } catch (err) {
        console.error('Error generating transparent data URL:', err);
        setProcessedSrc(src);
      }
    };

    img.onerror = () => {
      setProcessedSrc(src);
    };
  }, [src, tolerance]);

  return <img src={processedSrc} alt={alt} className={className} />;
};

export default TransparentAvatar;
