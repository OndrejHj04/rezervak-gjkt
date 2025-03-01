"use client";
import {
  ButtonBase,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useState } from "react";
import { dayjsExtended } from "@/lib/dayjsExtended";
import { MergeType } from "@mui/icons-material";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { store } from "@/store/store";

export default function DataOverviewTableRow({ user }: any) {
  const [toggleDetail, setToggleDetail] = useState(false);
  const { fusion, setFusion } = store();
  const isFuse = fusion.some((item: any) => item.id === user.id);

  const makeFusion = () => {
    if (isFuse) {
      setFusion(fusion.filter((item: any) => item.id !== user.id));
    } else {
      setFusion([...fusion, user]);
    }
  };

  return (
    <React.Fragment>
      <TableRow key={user.id}>
        <TableCell>
          <IconButton size="small" onClick={() => setToggleDetail((c) => !c)}>
            {toggleDetail ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <AvatarWrapper data={user} />
            {user.name}
          </div>
        </TableCell>
        <TableCell>{user.total_nights}</TableCell>
        <TableCell>
          <div className="flex items-center">
            <IconButton
              onClick={makeFusion}
              color={isFuse ? "success" : "inherit"}
            >
              <MergeType />
            </IconButton>
            {!!isFuse && <Typography>Řádek určený k fúzi</Typography>}
          </div>
        </TableCell>
      </TableRow>
      {toggleDetail && (
        <React.Fragment>
          <TableRow>
            <TableCell colSpan={2}>
              <Table size="small">
                <TableHead>
                  <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
                    <TableCell>Jméno</TableCell>
                    <TableCell>Počet nocí</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.user_detail.map((detail: any) => (
                    <TableRow key={detail.id}>
                      <TableCell>{detail.name}</TableCell>
                      <TableCell>{detail.total_nights}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableCell>
            <TableCell colSpan={2}>
              <Table size="small">
                <TableHead>
                  <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
                    <TableCell>Název</TableCell>
                    <TableCell>Datum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.reservation_detail.map((detail: any) => (
                    <TableRow key={detail.id}>
                      <TableCell>{detail.name}</TableCell>
                      <TableCell>
                        {`${dayjsExtended(detail.from_date).format(
                          "DD. MMMM"
                        )} - ${dayjsExtended(detail.to_date).format(
                          "DD. MMMM"
                        )}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
