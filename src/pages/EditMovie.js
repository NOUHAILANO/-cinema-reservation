import { useState } from "react";

export default function EditMovie({ movie, setEditingMovie, setMovies }) {
  const [title, setTitle] = useState(movie.title);
  const [category, setCategory] = useState(movie.category);
  const [description, setDescription] = useState(movie.description);
  const [price, setPrice] = useState(movie.price);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedMovie = { ...movie, title, category, description, price };
    fetch(`http://localhost:5001/movies/${movie.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMovie)
    }).then(() => {
      setMovies(prev => prev.map(m => m.id === movie.id ? updatedMovie : m));
      setEditingMovie(null);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-movie-form">
      <h2>Modifier le film</h2>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" />
      <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Catégorie" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Prix" />
      <button type="submit">Sauvegarder</button>
      <button type="button" onClick={() => setEditingMovie(null)}>Annuler</button>
    </form>
  );
}