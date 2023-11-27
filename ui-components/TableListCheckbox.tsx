"use client";

import { store } from "@/store/store";
import { Checkbox, TableCell } from "@mui/material";

export default function TableListCheckbox({
  prop,
  id,
}: {
  prop: any;
  id: any;
}) {
  const {
    selectedGroups,
    selectedReservations,
    selectedUsers,
    setSelectedGroups,
    setSelectedReservations,
    setSelectedUsers,
  } = store();

  const methods: any = {
    reservations: {
      read: selectedReservations,
      write: setSelectedReservations,
    },
    groups: {
      read: selectedGroups,
      write: setSelectedGroups,
    },
    users: {
      read: selectedUsers,
      write: setSelectedUsers,
    },
  };
  const { read, write } = methods[prop];
  const checked = read.includes(id);

  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (checked) {
      write(read.filter((i: any) => i !== id));
    } else {
      write([...read, id]);
    }
  };

  return (
    <TableCell>
      <Checkbox onClick={handleSelect} checked={Boolean(checked)} />
    </TableCell>
  );
}
