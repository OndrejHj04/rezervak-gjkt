import { Avatar } from "@mui/material";

export default function AvatarWrapper({
  data,
  size,
}: {
  data?: any;
  size?: any;
}) {
  const sizes = size || 40;

  if (data?.image) {
    return <Avatar src={data.image} sx={{ width: sizes, height: sizes }} />;
  }

  return <Avatar sx={{ width: sizes, height: sizes }} />;
}
