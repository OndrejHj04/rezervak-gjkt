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

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

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

export default function RoleSmallCard({ role }: { role: Role }) {
  const [expanded, setExpanded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Role>();

  const onSubmit = ({ role_color, role_name }: Role) => {
    console.log(role_name, role_color);
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
                defaultValue={role.role_name}
                label="Název role"
                {...register("role_name")}
              />
              <TextField
                variant="outlined"
                label="Barva role"
                {...register("role_color")}
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
