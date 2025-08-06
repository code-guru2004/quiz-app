export default function UserPage({ params }) {
  const { username,id } = params;

  return <h1>Hello, {username}{id}</h1>;
}
