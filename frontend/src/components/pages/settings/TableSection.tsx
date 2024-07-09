import { useState, useEffect } from "react";
import Button from "../../input/Button";
import { TrashIcon } from "@heroicons/react/16/solid";
import InputField from "../../input/InputField";
import mySWR, { postRequest, putRequest, deleteRequest } from "../../../utils/mySWR";
import Select from "../../input/Select";
import { mutate } from "swr";
import { log } from "util";

type Zone = { id: number; name: string; bookable: boolean; restaurant: number; tables: number[] };

export default function TableSection() {
  const [tables, setTables] = useState([]);
  const [zones, setZones] = useState<any>([]);
  const { data, error, loading, update } = mySWR("/tables/list/");
  const { data: zoneData, error: zoneError, loading: zoneLoading, update: zoneUpdate } = mySWR("/zones/list/");

  const [newZoneName, setNewZoneName] = useState("");

  useEffect(() => {
    if (data) {
      setTables(data);
    }
  }, [data]);

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

  const handleZoneUpdate = (id: number, name: string) => {
    setZones((prev: any) => {
      return prev.map((zone: any) => (zone.id === id ? { ...zone, name: name } : zone));
    });
    putRequest(`/zones/${id}/`, { name });
  };

  const handleZoneDelete = (id: number) => {
    setZones((prev: any) => {
      return prev.filter((zone: any) => zone.id !== id);
    });
    deleteRequest(`/zones/${id}/`);
  };

  function Zone({ zone }: { zone: Zone }) {
    const [newTableName, setNewTableName] = useState("");
    const [newTableCapacity, setNewTableCapacity] = useState("3");
    const [newTableZone, setNewTableZone] = useState("");

    console.log(newTableZone);

    const handleAddTable = async () => {
      const zoneId = zones.find((zone: any) => zone.name === newTableZone)?.id;
      const response = await postRequest("/tables/", { name: newTableName, capacity: parseInt(newTableCapacity), zone: zoneId });

      mutate("/zones/list/");
    };

    function TableItem({ table }: { table: any }) {
      const [name, setName] = useState(table.name);
      const [capacity, setCapacity] = useState(table.capacity);
      const [selectedZone, setSelectedZone] = useState(table.zone);

      const handleTableUpdate = async () => {
        const zoneId = zones.find((zone: any) => zone.name === selectedZone)?.id;
        console.log(table.zone, zoneId);

        const response = putRequest(`/tables/${table.id}/`, { name: name, capacity: capacity, zone: table.zone });

        mutate("/zones/list/");
      };

      const handleTableDelete = async () => {
        const response = deleteRequest(`/tables/${table.id}/`);
        mutate("/zones/list/");
        //setTables((prev) => {
        //  return prev.filter((table) => table.id !== id);
        //});
      };

      return (
        <div className="flex items-center gap-4">
          <InputField
            value={name}
            onChange={(val) => {
              setName(val);
              handleTableUpdate();
            }}
          />
          <InputField
            value={capacity.toString()}
            type="number"
            onChange={(val) => {
              setCapacity(val);
              handleTableUpdate();
            }}
          />
          <Select
            value={selectedZone}
            options={zones.map((zone: any) => [zone.id.toString(), zone.name])}
            onChange={(val) => {
              console.log(selectedZone);
              setSelectedZone(val);
              handleTableUpdate();
            }}
          />
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
            {/*<Select value={newTableZone} options={zones.map((zone: any) => [zone.id.toString(), zone.name])} onChange={(val) => setNewTableZone(val)} placeholder="Enter zone" />*/}
            <Button variant="secondary" onClick={handleAddTable}>
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

/*

export default function TableSection() {
  const [tables, setTables] = useState<Table[]>([]);
  const [newTableName, setNewTableName] = useState("");
  const [newTableChairs, setNewTableChairs] = useState("4");
  const { data, error, loading, update } = mySWR("/tables/list/");

  const { data: zones, error: zoneError, loading: zoneLoading, update: zoneUpdate } = mySWR("/zones/list/");
  const [newTableZone, setNewTableZone] = useState(undefined);

  useEffect(() => {
    if (data) {
      setTables(data);
    }
  }, [data]);

  useEffect(() => {
    if (zones && zones.length > 0) {
      setNewTableZone(zones[0].id);
    }
  }, [zones]);

  const handleAddTable = async () => {
    const response = await postRequest("/tables/", { name: newTableName, capacity: parseInt(newTableChairs), zone: newTableZone });

    setTables((prev) => {
      // POST to backend
      return [...prev, response.data];
    });
  };

  const cleanupDelete = (id: number) => {
    setTables((prev) => {
      const response = deleteRequest(`/tables/${id}/`);
      return prev.filter((table) => table.id !== id);
    });
  };

  const handleUpdateTable = (id: number, name: string, capacity: number, zone: number) => {
    const response = putRequest(`/tables/${id}/`, { name: name, capacity: capacity, zone: zone });

    setTables((prev) => {
      return prev.map((table) => (table.id === id ? { ...table, name, capacity, zone } : table));
    });
  };

  return (
    <div className="space-y-12">
      <div className="space-y-4 w-full">
        {tables.length > 0 && (
          <table className="w-full">
            <thead>
              <tr className="text-sm">
                <th className="font-normal">Name</th>
                <th className="font-normal">Chairs</th>
                <th className="font-normal">Zone</th>
                <th className="font-normal">Bookable</th>
                <th className="font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <TableRow zones={zones} key={table.id} handleUpdate={handleUpdateTable} cleanupDelete={cleanupDelete} table={table} />
              ))}
            </tbody>
          </table>
        )}

        <div className="flex gap-2 items-end">
          <InputField label="Create new table" placeholder="Enter table name" onChange={setNewTableName} />
          <InputField placeholder="Enter number of chairs" type="number" onChange={setNewTableChairs} />
          <Select options={zones?.map((zone: Zone) => [zone.id.toString(), zone.name])} placeholder="Enter zone" />
          <Button variant="secondary" onClick={handleAddTable}>
            +
          </Button>
        </div>
      </div>
      <Zones />
    </div>
  );
}

function TableRow({
  table,
  handleUpdate,
  cleanupDelete,
  zones,
}: {
  table: Table;
  handleUpdate: (id: number, name: string, capacity: number, zone: number) => void;
  cleanupDelete: (id: number) => void;
  zones: Zone[];
}) {
  const deleteTable = () => {
    // DELETE to backend
    console.log("DELETE to backend", table.id);
    cleanupDelete(table.id);
  };

  return (
    <tr>
      <td>
        <InputField value={table.name} onChange={(value) => handleUpdate(table.id, table.name, table.capacity, table.zone)} />
      </td>
      <td>
        <InputField value={table.capacity.toString()} onChange={(value) => handleUpdate(table.id, table.name, table.capacity, table.zone)} type="number" />
      </td>
      <td>
        <Select value={zones?.find((zone) => zone.id === table.zone)?.name} options={zones?.map((zone: Zone) => [zone.id.toString(), zone.name])} placeholder="Enter zone" />
      </td>
      <td>
        <div className="h-5 w-5">
          <InputField type="checkbox" value="true" />
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
  name: string;
  capacity: number;
  bookable: boolean;
  combinable: boolean;
  zone: number;
};

function Zones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const { data, error, loading, update } = mySWR("/zones/list/");

  useEffect(() => {
    if (data) {
      setZones(data);
    }
  }, [data]);

  const [newZoneName, setNewZoneName] = useState("");

  const addZone = async () => {
    const response = await postRequest("/zones/", { name: newZoneName });
    mutate("/zones/list/");

    setZones((prev) => {
      // POST to backend
      const newZone = response.data;
      return [...prev, newZone];
    });
    setNewZoneName("");
  };

  const handleZoneUpdate = (id: number, name: string) => {
    setZones((prev) => {
      return prev.map((zone) => (zone.id === id ? { ...zone, name: name } : zone));
    });
    putRequest(`/zones/${id}/`, { name });
  };

  const handleZoneDelete = (id: number) => {
    setZones((prev) => {
      return prev.filter((zone) => zone.id !== id);
    });
    deleteRequest(`/zones/${id}/`);
  };

  return (
    <div className="space-y-4">
      {zones.map((zone) => (
        <div key={zone.id} className="flex items-center gap-4">
          <InputField placeholder="Enter zone name" value={zone.name} onChange={(value) => handleZoneUpdate(zone.id, value)} />
          <Button variant="secondary" onClick={() => handleZoneDelete(zone.id)}>
            Delete
          </Button>
        </div>
      ))}
      <div className="flex gap-2 items-end">
        <InputField label="Create new zone" placeholder="Enter zone name" value={newZoneName} onChange={setNewZoneName} />
        <Button variant="secondary" onClick={addZone}>
          Create a new zone
        </Button>
      </div>
    </div>
  );
}
  */
