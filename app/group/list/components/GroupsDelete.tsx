"use client";

import { Badge, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { store } from "@/store/store";
import { toast } from "react-toastify";
import { removeGroups } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function GroupsDelete() {
  const { selectedGroups, setSelectedGroups } = store();
  const { refresh } = useRouter()
  const handleRemove = () => {
    removeGroups({ groups: selectedGroups }).then(({ success }) => {
      success && toast.success("Skupiny úspěšně odstraněny");
      !success && toast.error("Něco se pokazilo");
      refresh()
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
