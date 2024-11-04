import React from "react";
import { SidebarItemsType } from "../../types/sidebar";
import SidebarNavList from "./SidebarNavList";
import SidebarNavListSkeleton from "./SidebarNavListSkeleton";

type SidebarNavSectionProps = {
  className?: Element;
  component?: React.ElementType;
  pages: SidebarItemsType[];
  minimize: number;
};

const SidebarNavSection: React.FC<SidebarNavSectionProps> = (props) => {
  const {
    pages,
    className,
    minimize,
    component: Component = "nav",
    ...rest
  } = props;

  return (
    <Component {...rest}>
      {pages.length > 0 ? (
        <SidebarNavList pages={pages} depth={0} minimize={minimize} />
      ) : (
        <SidebarNavListSkeleton />
      )}
    </Component>
  );
};

export default SidebarNavSection;
