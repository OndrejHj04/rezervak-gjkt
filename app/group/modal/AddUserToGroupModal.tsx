import { Group } from "@/types";
import { Divider, Modal, Paper, Typography } from "@mui/material";
import { User as NextAuthUser } from "next-auth";
import { useEffect, useState } from "react";

interface User extends NextAuthUser {
  full_name: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddUserToGroupModal({ group }: { group: Group }) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`)
      .then((res) => res.json())
      .then(({ data }) => setUsers(data));
  }, []);

  return (
    <Modal open={true}>
      <Paper sx={style} className="p-4 flex flex-col max-w-sm">
        <div className="flex items-center justify-between">
          <Typography variant="h5">Spravovat uživatele</Typography>
        </div>
        <Divider className="mb-2" />
        <Typography>Do skupiny: {group.name}</Typography>
        <Typography>Akuální počet uživatelů {group.users.length}</Typography>
      </Paper>
    </Modal>
  );
}
