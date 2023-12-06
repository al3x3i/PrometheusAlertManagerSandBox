const express = require("express");
const bodyParser = require("body-parser");
const prometheus = require("prom-client");

const app = express();
const port = 3000;

// Parse JSON bodies
app.use(bodyParser.json());

// Create a Prometheus registry
const prometheusRegistry = new prometheus.Registry();

// Enable the collection of default metrics
prometheus.collectDefaultMetrics({ register: prometheusRegistry });

const alertCounter = new prometheus.Counter({
  name: "add_bid_request_total",
  help: "Total number of times the `add-bid` end-point was fired",
  labelNames: [
    "host",
    "path",
    "ingress_class",
    "namespace",
    "team",
    "service",
    "backend",
  ],
  registers: [prometheusRegistry],
});

let apiAlertCounter = 0;

app.get("/metrics", async (req, res) => {
  const metrics = await prometheusRegistry.metrics();
  res.setHeader("Content-Type", prometheusRegistry.contentType);
  res.end(metrics);
});

/*
curl -X POST -H "Content-Type: application/json" -d '{"host": "example.com", "path": "/example", "ingress_class": "example-ingress", "namespace": "example-namespace", "team": "example-team", "service": "example-service", "backend": "example-backend"}' http://localhost:3000/add-bid

*/
app.post("/add-bid", (req, res) => {
  const { host, path, ingress_class, namespace, team, service, backend } =
    req.body;

  if (
    !host ||
    !path ||
    !ingress_class ||
    !namespace ||
    !team ||
    !service ||
    !backend
  ) {
    return res.status(400).send("Missing body params");
  }

  const labels = {
    host,
    path,
    ingress_class,
    namespace,
    team,
    service,
    backend,
  };

  alertCounter.inc(labels);

  res.send("Request accepted");
});

// Endpoint to handle incoming prometheus - alerts
app.post("/alerts", (req, res) => {
  const alert = req.body;
  console.log(`Received alert Nr: (${apiAlertCounter}) from:`);
  console.log(JSON.stringify(alert, null, 2));

  console.log(`Alert Nr: ${apiAlertCounter} End===========`);
  console.log('\n')
  apiAlertCounter++;
  // Print nested objects, not formatted
  // console.log("Received alert from: %j", alert);
  res.status(200).send("OK");
});

// Start the server
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
