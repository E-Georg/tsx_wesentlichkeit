export default function Environment() {
  const phpExtension = import.meta.env.VITE_PHP_EXTENSION;
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <div>
      <p>PHO Extension: {phpExtension}</p>
      <p>API URL: {apiUrl}</p>
    </div>
  );
}
