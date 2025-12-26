# Tech Stack – AI-Powered Vercel Clone

| Layer | Tech Choice | Purpose |
|-------|------------|---------|
| Frontend | Next.js + Tailwind CSS + TypeScript | UI, SSR, and Cursor-friendly MVP |
| Backend | Node.js + Express / Next API | Deployment API, user management |
| AI Layer | OpenAI API (Codex/GPT) | Deployment optimization, error fixing, predictive scaling |
| Database | PostgreSQL / MongoDB | Users, projects, deployments, logs |
| Cache | Redis | Store build artifacts & rate-limiting |
| Storage | S3 / MinIO | Deployment files, static assets |
| Deployment | AWS Lambda / Cloudflare Workers | Serverless execution |
| Messaging | RabbitMQ / Kafka | Event queue for deployments & logs |
| Monitoring | Prometheus + Grafana / Sentry | Metrics, logs, error tracking |
| Domains & SSL | Let's Encrypt API | Custom domain provisioning & SSL |
| CI/CD | Custom pipeline | Delta builds, incremental deployment |
