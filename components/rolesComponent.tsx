"use client";
import RoleSmallCard from "@/sub-components/RoleSmallCard";
import { Role } from "@/types";
import { CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function RolesComponent() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const getRoles = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/roles/list")
      .then((res) => res.json())
      .then(({ data }) => {
        setRoles(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <>
      <Paper className="flex flex-col p-2 gap-2 h-min">
        <Typography variant="h5">Správa rolí</Typography>
        {loading ? (
          <CircularProgress className="mx-auto" />
        ) : (
          roles.map((role) => (
            <RoleSmallCard key={role.id} role={role} refresh={getRoles} />
          ))
        )}
      </Paper>
    </>
  );
}
