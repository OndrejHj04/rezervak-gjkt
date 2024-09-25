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
import React from "react";
import versionsData from "./verzovnik.data"

export default function ChangelogPage() {
  return (
    <React.Fragment>
      <Typography className="mb-3" variant="h5">
        Verzovnik
      </Typography>
      {versionsData.versions.map(({ title, features }, i) => (
        <Accordion key={i} defaultExpanded={i === 0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {title}
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {features.map((feat, x) => {
                return (
                  <ListItem key={x}>
                    <ListItemIcon>{feat.icon}</ListItemIcon>
                    <ListItemText primary={feat.content} secondary={feat.name} />
                  </ListItem>
                )
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </React.Fragment>
  );
}
