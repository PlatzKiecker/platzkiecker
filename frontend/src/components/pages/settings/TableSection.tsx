import { useState, useEffect } from "react";
import Button from "../../input/Button";
import { TrashIcon } from "@heroicons/react/16/solid";
import InputField from "../../input/InputField";

export default function TableSection() {
  const [tables, setTables] = useState<Table[]>([]);

  const handleAddTable = () => {
    setTables((prev) => {
      // POST to backend
      console.log("POST to backend");

      const newTable = { id: 1, chairs: 0 }; // Add the 'chairs' property with a default value
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
    <div className="space-y-4 w-full">
      <table className="w-full">
        <tr>
          <th>Table ID</th>
          <th>Chairs</th>
          <th>Action</th>
        </tr>
        {tables.map((table) => (
          <TableRow key={table.id} cleanupDelete={handleDeleteTable} table={table} />
        ))}
      </table>
      <Button variant="secondary" onClick={handleAddTable}>
        +
      </Button>
    </div>
  );
}

function TableRow({ table, cleanupDelete }: { table: Table; cleanupDelete: (id: number) => void }) {
  const deleteTable = () => {
    // DELETE to backend
    console.log("DELETE to backend", table.id);
  };
  const updateTable = (chairs: number) => {
    // PUT to backend
    console.log("PUT to backend", table.id, chairs);
    cleanupDelete(table.id);
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateTable(table.chairs);
      }, 1000);
    };
  }, [table.chairs]);

  return (
    <tr>
      <td>{table.id}</td>
      <td>
        <div className="w-32">
          <InputField value={table.chairs.toString()} onChange={(value) => updateTable(parseInt(value))} type="number" />
        </div>
      </td>
      <td className="mr-0">
        <Button variant="secondary" onClick={deleteTable}>
          <TrashIcon className="text-red-500 h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

type Table = {
  id: number;
  chairs: number;
};
