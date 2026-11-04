import React from "react";
import { CatalogPage } from "./CatalogPage";

export const BridalPage: React.FC = () => {
  return (
    <CatalogPage
      forcedDepartment="Bridal"
      pageTitle="The Imperial Bridal Collection"
      pageSubtitle="Regal kundan jadau chokers, multilayered bridal haars, matching matha pattis, and heirloom sets handcrafted for the bride."
    />
  );
};
