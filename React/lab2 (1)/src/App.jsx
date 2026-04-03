import { useState } from "react";
import users from "./users";
import UserCard from "./UserCard";

function App() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(users);

  function handleSearch() {
    const results = users.filter(user =>
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(results);
    setSearched(true);
  }

  function handleReset() {
    setQuery("");
    setFilteredUsers(users);
    setSearched(false);
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <h1 className="h3 fw-semibold text-dark mb-4">Users</h1>

        <div className="d-flex flex-column flex-sm-row gap-2 mb-4">
        <input
          className="form-control"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email"
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        {searched && (
          <button className="btn btn-outline-secondary" onClick={handleReset}>Reset</button>
        )}
        </div>

        <div className="row g-3">
        {filteredUsers.map(user => (
            <div key={user.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <UserCard props={user} />
            </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default App;