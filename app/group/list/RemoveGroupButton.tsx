"use client";
import { Badge, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { store } from "@/store/store";
import { toast } from "react-toastify";
import MakeRefetch from "./refetch";

export default function RemoveGroups() {
  const { selectedGroups, setSelectedGroups } = store();

  const handleRemoveGroups = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/remove`, {
      method: "POST",
      body: JSON.stringify({ groups: selectedGroups }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) toast.success("Skupiny byly úspěšně odstraněny");
        else toast.error("Něco se pokazilo");
        MakeRefetch();
        setSelectedGroups([]);
      });
  };

  return (
    <div>
      <IconButton
        disabled={!selectedGroups.length}
        sx={{ opacity: selectedGroups.length ? 1 : 0.5 }}
        onClick={handleRemoveGroups}
      >
        <Badge badgeContent={selectedGroups.length} color="error">
          <DeleteIcon color="error" sx={{ width: 36, height: 36 }} />
        </Badge>
      </IconButton>
    </div>
  );
}
