import { getSettings } from "@/lib/api";
import React from "react";
import SettingsForm from "./SettingsForm";

export default async function Settings() {
  const { data } = await getSettings();

  return <SettingsForm data={data}/>
}
