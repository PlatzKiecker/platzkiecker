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

  const cleanupDelete = (id: number) => {
    setTables((prev) => {
      // TODO: DELETE to backend
      return prev.filter((table) => table.id !== id);
    });
  };

  const handleUpdateTable = (id: number, chairs: number) => {
    setTables((prev) => {
      // PUT to backend
      console.log("PUT to backend", id, chairs);

      return prev.map((table) => (table.id === id ? { ...table, chairs } : table));
    });
  };

  return (
    <div className="space-y-4 w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th>Table ID</th>
            <th>Chairs</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <TableRow key={table.id} handleUpdate={handleUpdateTable} cleanupDelete={cleanupDelete} table={table} />
          ))}
        </tbody>
      </table>
      <Button variant="secondary" onClick={handleAddTable}>
        +
      </Button>
    </div>
  );
}

function TableRow({ table, handleUpdate, cleanupDelete }: { table: Table; handleUpdate: (id: number, chairs: number) => void; cleanupDelete: (id: number) => void }) {
  const deleteTable = () => {
    // DELETE to backend
    console.log("DELETE to backend", table.id);
    cleanupDelete(table.id);
  };

  return (
    <tr>
      <td>{table.id}</td>
      <td>
        <div className="w-32">
          <InputField value={table.chairs.toString()} onChange={(value) => handleUpdate(table.id, parseInt(value))} type="number" />
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
