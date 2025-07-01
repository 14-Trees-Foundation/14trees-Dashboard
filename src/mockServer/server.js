import { createServer } from "miragejs";
export function makeServer({ environment = "development" }) {
  let server = createServer({
    environment,
    routes() {
      this.timing = 5000;
      this.urlPrefix = "http://localhost:8088";
      this.get("/api/profile", () => {
        return {
          status: "success",
          name: "Geeta Nair",
          organisation: "Arista Netwroks",
          profile_image:
            "https://14treesplants.s3.ap-south-1.amazonaws.com/gallery/a.jpg",
          treesPlanted: [
            {
              id: "e86b48c0-08fe-4e44-a5a5-44f3a2621b75",
              sapling_id: "2049",
              name: "Tamarind",
              height: null,
              date_added: "2021-01-04T18:39:12.000Z",
              location: '{"lat":18.94,"lng":73.79}',
              image:
                "https://14treesplants.s3.ap-south-1.amazonaws.com/treeimages/tamarind.jpeg",
              memories: [
                "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/a.jpg",
                "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/b.jpg",
                "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/c.jpg",
              ],
            },
          ],
        };
      });
      this.get("/api/analytics/totaltree", () => {
        return [{ count: "436" }];
      });
      this.get("/api/analytics/ponds", () => {
        return {
          status: "success",
          count: "8",
          images: [
            {
              original:
                "https://14treesplants.s3.ap-south-1.amazonaws.com/ponds/1.jpg",
            },
            {
              original:
                "https://14treesplants.s3.ap-south-1.amazonaws.com/ponds/2.jpg",
            },
            {
              original:
                "https://14treesplants.s3.ap-south-1.amazonaws.com/ponds/3.jpg",
            },
            {
              original:
                "https://14treesplants.s3.ap-south-1.amazonaws.com/ponds/4.jpg",
            },
            {
              original:
                "https://14treesplants.s3.ap-south-1.amazonaws.com/ponds/5.jpg",
            },
            {
              original:
                "https://14treesplants.s3.ap-south-1.amazonaws.com/ponds/6.jpg",
            },
            {
              original:
                "https://14treesplants.s3.ap-south-1.amazonaws.com/ponds/7.jpg",
            },
            {
              original:
                "https://14treesplants.s3.ap-south-1.amazonaws.com/ponds/8.jpg",
            },
          ],
        };
      });
      this.get("/api/analytics/summary", () => {
        return {
          treeCount: 1250,
          plantTypeCount: 45,
          bookedTreeCount: 320,
          assignedTreeCount: 890,
          userCount: 156,
          personalGiftRequestsCount: 25,
          personalGiftedTreesCount: 78,
          corporateGiftRequestsCount: 12,
          corporateGiftedTreesCount: 145,
          totalGiftRequests: 37,
          totalGiftedTrees: 223,
          sitesCount: 8,
          plotCount: 24,
          pondCount: 8,
          districtsCount: 3,
          talukasCount: 12,
          villagesCount: 18,
          landTypeCounts: {
            "Agricultural Land": 450,
            "Forest Land": 320,
            "Wasteland": 280,
            "Community Land": 200
          }
        };
      });
      this.get("/api/trees/loggedbydate", () => {
        return [
          {
            _id: "2024-01-15T00:00:00.000Z",
            count: 25
          },
          {
            _id: "2024-01-16T00:00:00.000Z",
            count: 18
          },
          {
            _id: "2024-01-17T00:00:00.000Z",
            count: 32
          },
          {
            _id: "2024-01-18T00:00:00.000Z",
            count: 14
          },
          {
            _id: "2024-01-19T00:00:00.000Z",
            count: 28
          },
          {
            _id: "2024-01-20T00:00:00.000Z",
            count: 22
          },
          {
            _id: "2024-01-21T00:00:00.000Z",
            count: 35
          }
        ];
      });
    },
  });
  return server;
}
