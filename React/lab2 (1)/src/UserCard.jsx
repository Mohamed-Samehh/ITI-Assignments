const roleBadgeClasses = {
  admin: "text-bg-danger",
  user: "text-bg-success",
  moderator: "text-bg-warning text-dark"
};

function UserCard({ props }) {
  const badgeClass = roleBadgeClasses[props.role] || "text-bg-secondary";

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body text-center">
        <img
          src={props.picture}
          alt={props.username}
          className="rounded-circle mb-3"
          width="72"
          height="72"
        />
        <div className="mb-2">
          <span className={`badge ${badgeClass}`}>{props.role}</span>
        </div>
        <h2 className="h6 mb-2">{props.username}</h2>
        <p className="mb-1 text-muted small">{props.email}</p>
        <p className="mb-1 text-muted small">{props.phone}</p>
        <p className="mb-0 text-muted small">{props.birthdate}</p>
      </div>
    </div>
  );
}

export default UserCard;