
const SERVERURL = "https://jsonplaceholder.typicode.com"
export async function apiFetch(url) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer THE_TOKEN',
    };
  
    const response = await fetch(SERVERURL+url, headers);
  
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.');
      error.info = await response.json();
      error.status = response.status;
      throw error;
    }
  
    return response.json();
  }
  