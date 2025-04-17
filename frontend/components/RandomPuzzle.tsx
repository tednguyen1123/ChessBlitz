export async function fetchRandomPuzzle(): Promise<any> {
  try {
    const response = await fetch('http://127.0.0.1:5000/puzzles/random/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data; // Return the JSON object for the puzzle
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An unknown error occurred');
  }
}

// {FEN, ID, Moves, Rating}