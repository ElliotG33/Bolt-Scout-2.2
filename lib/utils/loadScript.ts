export const loadScript = (src: string, callback: () => void): void => {
  // Check if the script is already loaded
  if (document.querySelector(`script[src="${src}"]`)) {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = callback;
  document.head.appendChild(script);
};
