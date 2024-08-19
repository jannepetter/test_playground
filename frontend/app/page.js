import { apiFetch } from "./utils/fetcher";

export default function Home() {
  apiFetch("/todos").then(r=>
    console.log(r)).catch(e=>
      console.log(e))
  return (
    <main>
      <h1>The app</h1>
    </main>
  );
}
