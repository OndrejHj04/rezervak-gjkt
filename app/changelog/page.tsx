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
import versionsData from "./changelog.data"
import { changeTypeEnum } from "./changelog.types";
import ChangeTypeSelect from "./ChangeTypeSelect"

export default function ChangelogPage({ searchParams: { changeTypeId = ""} }: { searchParams: { changeTypeId: string } }) {

  const filter = changeTypeId.split(",")

  return (
    <React.Fragment>
      <div className="flex justify-between sm:flex-row flex-col gap-2 items-center">
        <Typography variant="h5">
          Changelog
        </Typography>
        <ChangeTypeSelect changeTypes={changeTypeEnum.list} />
      </div>
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
                if (filter.includes(feat.name)) {
                  return (
                    <ListItem key={x}>
                      <ListItemIcon>{feat.icon}</ListItemIcon>
                      <ListItemText primary={feat.content} secondary={feat.name} />
                    </ListItem>
                  )
                }
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </React.Fragment>
  );
}
