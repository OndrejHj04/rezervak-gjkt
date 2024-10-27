"use client"

import { groupsDelete } from "@/lib/api";
import { Button } from "@mui/material"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function GroupDeleteButton({ groupId, disabled }: { groupId: any, disabled: any }) {
  const { replace } = useRouter()

  const handleRemoveGroup = () => {
    groupsDelete({ groups: [groupId] }).then(({ success }) => {
      if (success) toast.success("Skupina úspěšně odstraněna");
      else toast.error("Něco se nepovedlo");
      replace("/group/list")
    });
  };

  return (
    <Button
      onClick={handleRemoveGroup}
      variant="outlined"
      disabled={disabled}
      color="error"
      size="small"
    >
      Odstranit skupinu
    </Button>
  )
}
