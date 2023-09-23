"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  IconButtonProps,
  Typography,
  styled,
} from "@mui/material";
import { User } from "next-auth";
import { useEffect, useRef, useState } from "react";

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

export default function UserSmallCard({ user }: { user: User }) {
  const [expanded, setExpanded] = useState(false);
  console.log(user);
  return (
    <Card key={user.id}>
      <CardHeader
        avatar={<Avatar />}
        action={
          <ExpandMore
            expand={expanded}
            onClick={() => setExpanded((c) => !c)}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        }
        title={
          <div className="flex gap-2">
            <Typography>{user.username}</Typography>
            <Chip
              sx={{ backgroundColor: user.role.role_color }}
              size="small"
              label={<Typography>#{user.role.role_name}</Typography>}
            />
          </div>
        }
        subheader={<Typography variant="body2">{user.email}</Typography>}
      ></CardHeader>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2">#{user.id}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
