import { useState, useEffect } from "react";
import Button from "../../input/Button";
import { TrashIcon } from "@heroicons/react/16/solid";
import InputField from "../../input/InputField";
import mySWR, { postRequest, putRequest, deleteRequest } from "../../../utils/mySWR";
import Select from "../../input/Select";
import { mutate } from "swr";

type Zone = { id: number; name: string; bookable: boolean; restaurant: number; tables: number[] };

export default function TableSection() {
  const [zones, setZones] = useState<any>([]);
  const { data, error, loading, update } = mySWR("/tables/list/");
  const { data: zoneData, error: zoneError, loading: zoneLoading, update: zoneUpdate } = mySWR("/zones/list/");

  const [newZoneName, setNewZoneName] = useState("");

  useEffect(() => {
    if (zoneData) {
      setZones(zoneData);
    }
  }, [zoneData]);

  const handleAddZone = async () => {
    const response = await postRequest("/zones/", { name: newZoneName });

    setZones((prev: any) => {
      // POST to backend
      const newZone = response.data;
      return [...prev, newZone];
    });
    setNewZoneName("");
  };

  const handleZoneUpdate = async (id: number, name: string) => {
    setZones((prev: any) => {
      return prev.map((zone: any) => (zone.id === id ? { ...zone, name: name } : zone));
    });
    await putRequest(`/zones/${id}/`, { name });
  };

  const handleZoneDelete = async (id: number) => {
    setZones((prev: any) => {
      return prev.filter((zone: any) => zone.id !== id);
    });
    await deleteRequest(`/zones/${id}/`);
  };

  function Zone({ zone }: { zone: Zone }) {
    const [newTableName, setNewTableName] = useState("");
    const [newTableCapacity, setNewTableCapacity] = useState("3");

    const handleAddTable = async (zoneId: number) => {
      const response = await postRequest("/tables/", { name: newTableName, capacity: parseInt(newTableCapacity), zone: zoneId, bookable: true });
      setZones((prev: any) => {
        return prev.map((zone: any) => {
          if (zone.id === zoneId) {
            return { ...zone, tables: [...zone.tables, response.data] };
          }
          return zone;
        });
      });
    };

    function TableItem({ table }: { table: any }) {
      const [name, setName] = useState(table.name);
      const [capacity, setCapacity] = useState(table.capacity);
      const [selectedZone, setSelectedZone] = useState(table.zone);

      const handleTableUpdate = async (name: string, capacity: string) => {
        if (name === "") return;
        if (capacity === "") return;
        if (selectedZone === "") return;
        console.log("Table update", name, capacity, selectedZone);

        const zoneId = zones.find((zone: any) => zone.name === selectedZone)?.id;
        const response = await putRequest(`/tables/${table.id}/`, { name: name, capacity: parseInt(capacity), zone: table.zone });
      };

      const handleTableDelete = async () => {
        const response = await deleteRequest(`/tables/${table.id}/`);
        setZones((prev: any) => {
          return prev.map((zone: any) => {
            return { ...zone, tables: zone.tables.filter((t: any) => t.id !== table.id) };
          });
        });
      };

      return (
        <div className="flex items-center gap-4">
          <InputField
            value={name}
            onChange={(val) => {
              setName(val);
              handleTableUpdate(val, capacity.toString());
            }}
          />
          <InputField
            value={capacity.toString()}
            type="number"
            onChange={(val) => {
              setCapacity(val);
              handleTableUpdate(name, val);
            }}
          />
          <p></p>
          <Button variant="secondary" onClick={handleTableDelete}>
            <TrashIcon className="text-red-500 h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div key={zone.id} className="flex items-end gap-4">
          <InputField onChange={(val) => handleZoneUpdate(zone.id, val)} label={"Zone: " + zone.name} placeholder="Enter zone name" value={zone.name} />
          <Button variant="secondary" onClick={() => handleZoneDelete(zone.id)}>
            Delete
          </Button>
        </div>
        <div>
          <div>
            {zone.tables.map((table: any) => (
              <div key={table.id} className="flex items-end gap-4">
                <TableItem table={table} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <InputField value={newTableName} onChange={setNewTableName} placeholder="Enter table name" />
            <InputField value={newTableCapacity} onChange={setNewTableCapacity} placeholder="Enter number of chairs" type="number" />
            <Button variant="secondary" onClick={() => handleAddTable(zone.id)}>
              +
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-4 w-full">
        <div className="space-y-8">
          {zones.map((zone: any) => (
            <Zone key={zone.id} zone={zone} />
          ))}
          <div className="flex gap-2 items-end">
            <InputField label="Create new zone" placeholder="Enter zone name" value={newZoneName} onChange={setNewZoneName} />
            <Button variant="secondary" onClick={handleAddZone}>
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
