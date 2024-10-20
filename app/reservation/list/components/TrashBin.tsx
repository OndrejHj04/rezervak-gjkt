"use client";
import { Badge, IconButton } from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { store } from "@/store/store";
import { reservationsDelete } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TrashBin() {
  const { selectedReservations, setSelectedReservations } = store();
  const { refresh } = useRouter()
  const handleRemove = () => {
    reservationsDelete({ reservations: selectedReservations }).then((res) => {
      if (res.success) toast.success("Rezervace úspěšně odstraněny");
      else toast.error("Něco se pokazilo");
    });
    refresh()
    setSelectedReservations([]);
  };

  return (
    <div>
      <IconButton
        disabled={!selectedReservations.length}
        sx={{ opacity: selectedReservations.length ? 1 : 0.5 }}
        onClick={handleRemove}
      >
        <Badge badgeContent={selectedReservations.length} color="error">
          <DeleteIcon color="error" sx={{ width: 36, height: 36 }} />
        </Badge>
      </IconButton>
    </div>
  );
}
