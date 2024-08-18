import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import changelog from "./verzovnik.json";
import React from "react";

export default function ChangelogPage() {
  const { versions } = changelog;
  console.log(versions);
  return (
    <React.Fragment>
      <Typography className="mb-3" variant="h5">
        Verzovnik
      </Typography>
      {versions.map(({ title, features }, i) => (
        <Accordion key={i}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {title}
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {features.map((feat, x) => (
                <ListItem key={x}>
                  <ListItemIcon>{feat.icon}</ListItemIcon>
                  <ListItemText primary={feat.content} secondary={feat.name} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </React.Fragment>
  );
}
