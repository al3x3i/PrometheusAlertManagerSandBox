# Prometheus Alerts Learning Path

This repository serves as a comprehensive guide for setting up Prometheus, Alert Manager, and an Express server to demonstrate a complete monitoring and alerting system. Alerts triggered by Prometheus are forwarded to the Express application through Alert Manager, showcasing real-world alerting scenarios. Alert Manager was set up to pass properties that can be utilized in Opsgenie management platform.

## Description

This project provides configurations for Prometheus, Alert Manager, and an Express application, demonstrating a practical setup for monitoring and alerting. The Express server plays a crucial role in receiving and handling alerts forwarded by Alert Manager. 

## Requirements

To run this project, ensure you have the following prerequisites:

- Docker
- Node.js (for Express application)
- Chromium (optional, for viewing alerts)

## Prometheus Alert Manager uses Go templates.
Customize them based the specifications.
Documentation: https://pkg.go.dev/text/template

## Getting started

### (Optional) Stop already running express server:
```bash
sudo fuser -k  3000/tcp
```

### Install Node.js dependencies:
```bash
npm install --prefix ./express ./express
```

### Start the services:
```bash
docker-compose up -d
```

## Trigger alert:

### Default endpoint
```bash
curl http://localhost:8080
curl http://localhost:8080
curl http://localhost:8080
```

### Express server endpoint
check alert rules to fire alert, ex:  `expr: sum(add_bid_request_total) % 2 == 0`

```bash
curl -X POST -H "Content-Type: application/json" -d '{"host": "example.com", "path": "/example", "ingress_class": "example-ingress", "namespace": "ddd-namespace", "team": "example-team", "service": "example-service", "backend": "example-backend"}' http://localhost:3000/add-bid

curl -X POST -H "Content-Type: application/json" -d '{"host": "example.com", "path": "/example", "ingress_class": "example-ingress", "namespace": "ddd-namespace", "team": "example-team", "service": "example-service", "backend": "example-backend"}' http://localhost:3000/add-bid
```

## Alert logs

### In docker container:
```bash
docker logs express-server -f
```

### On Prometheus
```bash
chromium http://localhost:9090/alerts\?search\=
```