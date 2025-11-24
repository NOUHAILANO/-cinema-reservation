import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    fetch("http://localhost:3001/movies")
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) &&
    (category==="All" || m.category===category)
  );

  const totalPages = Math.ceil(filtered.length/limit);
  const paginated = filtered.slice((page-1)*limit, page*limit);

  const deleteMovie = id => {
    fetch(`http://localhost:3001/movies/${id}`,{method:"DELETE"})
    .then(()=>setMovies(movies.filter(m=>m.id!==id)));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Movies</h1>
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Search..." className="p-2 border rounded" value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="p-2 border rounded" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Romantic">Romantic</option>
          <option value="Tragedy">Tragedy</option>
          <option value="Cartoon">Cartoon</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paginated.map(movie => (
          <div key={movie.id} className="p-4 rounded shadow bg-white dark:bg-gray-800">
            <img src={movie.poster} className="w-full h-48 object-cover mb-2"/>
            <h2 className="text-xl font-bold">{movie.title}</h2>
            <p className="opacity-70">{movie.category}</p>
            <Link to={`/admin/movies/edit/${movie.id}`} className="px-4 py-2 bg-yellow-500 text-white rounded mt-2 inline-block">Edit</Link>
            <button onClick={()=>deleteMovie(movie.id)} className="px-4 py-2 bg-red-600 text-white rounded mt-2 ml-2">Delete</button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-4 py-2 bg-blue-600 text-white rounded">Prev</button>
        <span className="px-4 py-2">{page}/{totalPages}</span>
        <button disabled={page===totalPages} onClick={()=>setPage(page+1)} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
      </div>
    </div>
  );
}
