"use client";
import { User } from "@/models/User";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  IconButtonProps,
  Typography,
  styled,
} from "@mui/material";
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
        title={<Typography>{user.username}</Typography>}
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
