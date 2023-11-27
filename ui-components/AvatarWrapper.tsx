import { Avatar } from "@mui/material";

export default function AvatarWrapper({
  data,
  size,
}: {
  data?: any;
  size?: any;
}) {
  const sizes = size || 40;
  if (data) {
    if (!data?.image?.length) {
      return (
        <Avatar sx={{ height: sizes, width: sizes }}>
          {data?.first_name[0].toUpperCase()}
          {data?.last_name[0].toUpperCase()}
        </Avatar>
      );
    } else {
      return <Avatar src={data?.image} sx={{ height: sizes, width: sizes }} />;
    }
  }

  return <Avatar />;
}
