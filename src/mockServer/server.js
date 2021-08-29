import { createServer } from 'miragejs';
export function makeServer({ environment = 'development' }) {
    let server = createServer({
        environment,
        routes() {
            this.urlPrefix = 'http://localhost:7000';
            this.get('/api/v1/profile', () => {
                return {
                    "status":"success",
                    "name":"Geeta Nair",
                    "organisation":"Arista Netwroks",
                    "profile_image":"https://14treesplants.s3.ap-south-1.amazonaws.com/gallery/a.jpg",
                    "treesPlanted":[
                        {
                            "id":"e86b48c0-08fe-4e44-a5a5-44f3a2621b75",
                            "sapling_id":"2049",
                            "name":"Tamarind",
                            "height":null,
                            "date_added":
                            "2021-01-04T18:39:12.000Z",
                            "location":"{\"lat\":18.94,\"lng\":73.79}",
                            "image":"https://14treesplants.s3.ap-south-1.amazonaws.com/treeimages/tamarind.jpeg",
                            "memories":[
                                "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/a.jpg",
                                "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/b.jpg",
                                "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/c.jpg"]
                            }
                        ]
                    }
            });
            this.get('/api/v1/analytics/totaltree', () => {
                return [
                    {"count":"436"}
                ];
            });
        },
      });
  return server;
}