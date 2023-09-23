"use client";
import { Role } from "@/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  IconButtonProps,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import _ from "lodash";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const schema = yup.object().shape({
  id: yup.number().required(),
  role_name: yup.string().required(),
  role_color: yup.string().required().min(6).max(6),
});

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RoleSmallCard({
  role,
  refresh,
}: {
  role: Role;
  refresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<Role>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (role: Role) => {
    fetch("http://localhost:3000/api/roles/edit", {
      body: JSON.stringify(role),
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        refresh();
        toast.info(res.message);
      })
      .catch((e) => toast.error("Something went wrong"));
  };

  return (
    <>
      <Card style={{ width: 240 }}>
        <CardHeader
          action={
            <ExpandMore
              expand={expanded}
              onClick={() => setExpanded((c) => !c)}
            >
              <ExpandMoreIcon />
            </ExpandMore>
          }
          title={
            <Chip
              sx={{ backgroundColor: role.role_color }}
              label={<Typography>#{role.role_name}</Typography>}
            />
          }
        ></CardHeader>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-2">
              <TextField
                variant="outlined"
                defaultValue={role.id}
                InputProps={{
                  readOnly: true,
                }}
                label="ID"
                {...register("id")}
              />
              <TextField
                variant="outlined"
                error={!!errors.role_name}
                defaultValue={role.role_name}
                label="Název role"
                {...register("role_name")}
              />
              <TextField
                variant="outlined"
                label="Barva role"
                {...register("role_color")}
                error={!!errors.role_color}
                defaultValue={role.role_color.slice(1)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">#</InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" type="submit" disabled={!isDirty}>
                Uložit
              </Button>
            </CardContent>
          </form>
        </Collapse>
      </Card>
    </>
  );
}
