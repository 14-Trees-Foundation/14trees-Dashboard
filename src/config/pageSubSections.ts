import { TableChart, Settings, Analytics, People, Inventory, CardGiftcard, TrendingUp } from "@mui/icons-material";
import { PageSection } from "../hooks/usePageSections";

export interface PageSubSectionConfig {
  path: string;
  sections: PageSection[];
}

export const PAGE_SUB_SECTIONS: PageSubSectionConfig[] = [
  {
    path: 'donations',
    sections: [
      {
        displayName: "All Donations",
        sectionId: "donations-table",
        icon: TableChart,
      },
      {
        displayName: "Auto Processing",
        sectionId: "auto-processing-config",
        icon: Settings,
      }
    ]
  },
  {
    path: 'tree-cards',
    sections: [
      {
        displayName: "Tree Cards Table",
        sectionId: "tree-cards-table",
        icon: TableChart,
      },
      {
        displayName: "Sponsorship Chart",
        sectionId: "tree-cards-sponsorship",
        icon: TrendingUp,
      },
      {
        displayName: "Auto Processing",
        sectionId: "tree-cards-auto-processing",
        icon: Settings,
      }
    ]
  },
  // Add more pages with sub-sections here as needed
  // Example:
  // {
  //   path: 'corporate-dashboard',
  //   sections: [
  //     {
  //       displayName: "Analytics Overview",
  //       sectionId: "analytics-overview",
  //       icon: Analytics,
  //     },
  //     {
  //       displayName: "User Management",
  //       sectionId: "user-management", 
  //       icon: People,
  //     }
  //   ]
  // }
];

export const getSubSectionsForPage = (path: string): PageSection[] => {
  const pageConfig = PAGE_SUB_SECTIONS.find(config => config.path === path);
  return pageConfig ? pageConfig.sections : [];
};