"use client";

import { Badge, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { store } from "@/store/store";
import { toast } from "react-toastify";
import MakeGroupRefetch from "../refetch";
import fetcher from "@/lib/fetcher";

export default function GroupsDelete() {
  const { selectedGroups, setSelectedGroups } = store();

  const handleRemove = () => {
    fetcher(`/api/group/remove`, {
      method: "POST",
      body: JSON.stringify({ groups: selectedGroups }),
    })
      .then((res) => {
        if (res.success) toast.success("Rezervace byly úspěšně odstraněny");
        else toast.error("Něco se pokazilo");
        MakeGroupRefetch();
        setSelectedGroups([]);
      });
  };

  return (
    <div>
      <IconButton
        disabled={!selectedGroups.length}
        sx={{ opacity: selectedGroups.length ? 1 : 0.5 }}
        onClick={handleRemove}
      >
        <Badge badgeContent={selectedGroups.length} color="error">
          <DeleteIcon color="error" sx={{ width: 36, height: 36 }} />
        </Badge>
      </IconButton>
    </div>
  );
}
