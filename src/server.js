import http from "node:http";
import { json } from "./middlewares/json.js";
import { router } from "./routes/router.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const route = router.find(
    (route) => method === route.method && route.path.test(url)
  );

  if (route) {
    const routeParams = request.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    request.params = params;
    request.query = extractQueryParams(query) ?? {};

    route.handler(request, response);
  } else {
    return response.writeHead(404).end();
  }
});

server.listen(3333);
