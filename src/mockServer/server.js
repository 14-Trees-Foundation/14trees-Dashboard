import { createServer } from 'miragejs';
export function makeServer({ environment = 'development' }) {
    let server = createServer({
        environment,
        routes() {
            this.urlPrefix = 'http://localhost:7000';
            this.get('/api/v1/profile', () => {
                return [];
            });
            this.get('/api/v1/analytics/totaltree', () => {
                return [];
            });
        },
      });
  return server;
}