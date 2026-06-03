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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;

      // Helper to check if pixel is near black
      const isTarget = (r, g, b) => {
        return r < tolerance && g < tolerance && b < tolerance;
      };

      // Flood fill queue
      const visited = new Uint8Array(width * height);
      const queue = [];

      // Add boundary pixels as starting points
      for (let x = 0; x < width; x++) {
        queue.push([x, 0]);
        queue.push([x, height - 1]);
        visited[0 * width + x] = 1;
        visited[(height - 1) * width + x] = 1;
      }
      for (let y = 1; y < height - 1; y++) {
        queue.push([0, y]);
        queue.push([width - 1, y]);
        visited[y * width + 0] = 1;
        visited[y * width + (width - 1)] = 1;
      }

      // BFS to find all background pixels
      let head = 0;
      while (head < queue.length) {
        const [cx, cy] = queue[head++];
        const idx = (cy * width + cx) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        if (isTarget(r, g, b)) {
          // Make transparent
          data[idx + 3] = 0;

          // Check 4-neighbors
          const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1]
          ];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nidx = ny * width + nx;
              if (!visited[nidx]) {
                visited[nidx] = 1;
                queue.push([nx, ny]);
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      try {
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
