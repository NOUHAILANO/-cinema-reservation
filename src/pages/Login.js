import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import './Login.css';

function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Enter email and password");

    try {
      const res = await fetch(`http://localhost:5001/users?email=${email}`);
      const data = await res.json();

      if (data.length === 0) {
        const newUser = { name: name || email, email, password, role: "user" };
        const resAdd = await fetch("http://localhost:5001/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        });
        const createdUser = await resAdd.json();
        login(createdUser);
        alert("User registered and logged in!");
      } else {
        if (data[0].password !== password) {
          alert("Invalid password!");
          return;
        }
        login(data[0]);
        alert("Login successful!");
      }

      navigate("/");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, []);

  return (

   

    <div className="login-container">
      
      <form onSubmit={handleLogin}>
        <h2>Login / Register</h2>
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login / Register</button>
      </form>
    </div>
  );
}

export default Login;