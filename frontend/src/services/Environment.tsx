export default function Environment() {
  const PHP_EXTENSION = import.meta.env.VITE_PHP_EXTENSION;
  const API_URL = import.meta.env.VITE_API_URL;
  const API_URL2 = import.meta.env.VITE_API_URL2;

  return (
    <div>
      <p>PHO Extension: {PHP_EXTENSION}</p>
      <p>API URL: {API_URL}</p>
      <p>API URL: {API_URL2}</p>
    </div>
  );
}
