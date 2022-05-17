import { Client } from 'pg'

export const db = new Client({
  host: 'test-instance-1-cluster.cluster-cys30lik4v4w.us-east-1.rds.amazonaws.com',
  user: 'test-assignment',
  password: 'gfdjh24m,sddsf',
  database: 'test_assignment',
  port: 5432
})
