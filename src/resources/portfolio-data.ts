export type WorkProject = {
  id: string;
  titleVI: string;
  titleEN: string;
  constructionClassVI: string;
  constructionClassEN: string;
  locationVI: string;
  locationEN: string;
  primaryRoleVI: string;
  primaryRoleEN: string;
  cover: string; // Cover image for the Work page carousel
  images: string[]; // Detail images shown inside the modal
  details: {
    overviewVI: string;
    overviewEN: string;
    responsibilitiesVI: string[];
    responsibilitiesEN: string[];
  };
};

// Home images must come from: public/images/home
export const homeShowcaseImages: string[] = [
  "/images/home/IMG1.jpg",
  "/images/home/IMG2.jpg",
  "/images/home/IMG3.jpg",
];

const commonBimResponsibilitiesVI = [
  "Điều phối BIM, kiểm soát chất lượng mô hình và phối hợp liên bộ môn.",
  "Tham gia xây dựng / triển khai BEP (BIM Execution Plan) theo yêu cầu dự án (theo CV).",
  "Chuẩn hóa quy trình BIM và hỗ trợ đào tạo nội bộ (theo CV).",
];

const commonBimResponsibilitiesEN = [
  "BIM coordination, model quality control, and interdisciplinary coordination.",
  "Contributed to / implemented the BIM Execution Plan (BEP) per project requirements (per CV).",
  "Improved BIM standards and supported internal training (per CV).",
];

const commonDeliveryResponsibilitiesVI = [
  "Triển khai hồ sơ kiến trúc (bản vẽ chi tiết) và phối hợp các bên liên quan (theo CV).",
  "Thực hiện phối cảnh / render phục vụ trình bày (theo CV).",
];

const commonDeliveryResponsibilitiesEN = [
  "Prepared architectural deliverables (detailed drawings) and coordinated with stakeholders (per CV).",
  "Produced render/perspective views for presentation (per CV).",
];

const notSpecifiedVI = "Không có trong CV";
const notSpecifiedEN = "Not specified in the CV";

// Work images must come from: public/images/projects
// Cover (carousel): /images/projects/Wxx/CV01.jpg
// Details (modal): /images/projects/Wxx/IMG1.jpg, IMG2.jpg, ...
export const workProjects: WorkProject[] = [
  {
    id: "W01",
    titleVI: "Dự án 01",
    titleEN: "Project 01",
    constructionClassVI: "Cấp công trình: II",
    constructionClassEN: "Construction Class: II",
    locationVI: notSpecifiedVI,
    locationEN: notSpecifiedEN,
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/projects/W01/CV01.jpg",
    images: [
      "/images/projects/W01/IMG1.jpg",
      "/images/projects/W01/IMG2.jpg",
      "/images/projects/W01/IMG3.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV.",
      overviewEN: "Project information follows the CV.",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
  {
    id: "W02",
    titleVI: "Dự án 02",
    titleEN: "Project 02",
    constructionClassVI: "Cấp công trình: II",
    constructionClassEN: "Construction Class: II",
    locationVI: notSpecifiedVI,
    locationEN: notSpecifiedEN,
    primaryRoleVI: "Triển khai chính – Điều phối BIM",
    primaryRoleEN: "Main deployment – BIM Coordinator",
    cover: "/images/projects/W02/CV01.jpg",
    images: [
      "/images/projects/W02/IMG1.jpg",
      "/images/projects/W02/IMG2.jpg",
      "/images/projects/W02/IMG3.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV.",
      overviewEN: "Project information follows the CV.",
      responsibilitiesVI: [...commonBimResponsibilitiesVI, ...commonDeliveryResponsibilitiesVI],
      responsibilitiesEN: [...commonBimResponsibilitiesEN, ...commonDeliveryResponsibilitiesEN],
    },
  },
  {
    id: "W03",
    titleVI: "Dự án 03",
    titleEN: "Project 03",
    constructionClassVI: "Cấp công trình: I",
    constructionClassEN: "Construction Class: I",
    locationVI: notSpecifiedVI,
    locationEN: notSpecifiedEN,
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/projects/W03/CV01.jpg",
    images: [
      "/images/projects/W03/IMG1.jpg",
      "/images/projects/W03/IMG2.jpg",
      "/images/projects/W03/IMG3.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV.",
      overviewEN: "Project information follows the CV.",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
];
