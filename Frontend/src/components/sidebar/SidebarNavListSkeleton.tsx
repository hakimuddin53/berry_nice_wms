import { Skeleton, Stack } from "@mui/material";
import React from "react";

function MenuItemSkeleton(props: { width: string }) {
  return (
    <Skeleton
      sx={{ bgcolor: "grey.600" }}
      variant="rounded"
      height={25}
      width={props.width}
    />
  );
}

const SidebarNavListSkeleton: React.FC<{}> = () => {
  return (
    <Stack spacing={5} sx={{ mx: 6, mt: 5 }}>
      <MenuItemSkeleton width="100%" />
      <MenuItemSkeleton width="80%" />
      <MenuItemSkeleton width="80%" />
      <MenuItemSkeleton width="80%" />
      <MenuItemSkeleton width="80%" />

      <MenuItemSkeleton width="100%" />
      <MenuItemSkeleton width="80%" />
      <MenuItemSkeleton width="80%" />
      <MenuItemSkeleton width="80%" />
      <MenuItemSkeleton width="80%" />
    </Stack>
  );
};

export default SidebarNavListSkeleton;
