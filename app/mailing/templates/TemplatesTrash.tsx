"use client";
import { Badge, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { store } from "@/store/store";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";
import MailingRefetch from "../mailingRefetch";

export default function TemplatesTrash() {
  const { selectedTemplates, setSelectedTemplates } = store();

  const handleRemove = () => {
    fetcher(`/api/mailing/templates/delete`, {
      method: "POST",
      body: JSON.stringify({ templates: selectedTemplates }),
    }).then((res) => {
      if (res.success) toast.success("Skupiny byly úspěšně odstraněny");
      else toast.error("Něco se pokazilo");
      setSelectedTemplates([]);
      MailingRefetch("templates");
    });
  };
  return (
    <div>
      <IconButton
        disabled={!selectedTemplates.length}
        sx={{ opacity: selectedTemplates.length ? 1 : 0.5 }}
        onClick={handleRemove}
      >
        <Badge badgeContent={selectedTemplates.length} color="error">
          <DeleteIcon color="error" sx={{ width: 36, height: 36 }} />
        </Badge>
      </IconButton>
    </div>
  );
}
