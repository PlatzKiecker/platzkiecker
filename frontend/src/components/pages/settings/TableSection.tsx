import { useState } from "react";
import Button from "../../input/Button";

export default function TableSection() {
  const [tables, setTables] = useState<Table[]>([]);

  const handleAddTable = () => {
    setTables((prev) => {
      // POST to backend
      console.log("POST to backend");

      const newTable = { id: 1 };
      return [...prev, newTable];
    });
  };

  const handleDeleteTable = (id: number) => {
    setTables((prev) => {
      // TODO: DELETE to backend
      console.log("DELETE to backend", id);

      return prev.filter((table) => table.id !== id);
    });
  };

  return (
    <div>
      <h3 className="font-medium">Tables</h3>
      {tables.map((table) => (
        <TableField key={table.id} onDelete={handleDeleteTable} table={table} />
      ))}
      <Button variant="secondary" onClick={handleAddTable}>
        +
      </Button>
    </div>
  );
}
type Table = {
  id: number;
};

function TableField({ table, onDelete }: { table: Table; onDelete: (id: number) => void }) {
  return (
    <div>
      <h3 className="font-medium">{table.id}</h3>
      <Button variant="secondary" onClick={() => onDelete(table.id)}>
        Delete
      </Button>
    </div>
  );
}
