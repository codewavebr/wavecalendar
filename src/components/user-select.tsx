import { useCalendar } from "../scheduler-context";

export function UserSelect() {
  const { users, selectedUserId, setSelectedUserId } = useCalendar();

  return (
    <select
      value={selectedUserId}
      onChange={(event) => setSelectedUserId(event.target.value)}
      className="h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm md:w-48"
      aria-label="Selecionar usuario"
    >
      <option value="all">Todos</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}
