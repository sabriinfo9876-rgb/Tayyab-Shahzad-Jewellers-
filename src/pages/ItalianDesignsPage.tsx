import React from "react";
import { CatalogPage } from "./CatalogPage";

export const ItalianDesignsPage: React.FC = () => {
  return (
    <CatalogPage
      forcedDepartment="Italian Designs"
      pageTitle="Contemporary Italian Designs"
      pageSubtitle="Precision European goldsmithing featuring flexible woven tubular mesh cuffs, fluid links, and modern architectural elegance in 18K gold."
    />
  );
};
