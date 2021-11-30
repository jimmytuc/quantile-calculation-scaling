# Instruction

## ENV

```yml
PORT:
  description: port which server listen
  type: number
WORKER_COUNT:
  description: number of workers
  type: number
  default: 4 * cpu vcores
POOL_STORAGE_FILE:
  description: location of pools storage file
  default: ./pools.json
```

## Run project

```sh
export PORT=8000
export WORKER_COUNT=8
export POOL_STORAGE_FILE=./pools.json
node index.js
// or
yarn start
```

# API Document

- standard headers

```json
{
  "Content-Type": "application/json"
}
```

## Insert to Pools

### Request

- URL: http://127.0.0.1:8000/pools
- Method: POST

#### Body

```json
{
  "poolId": 123456,
  "poolValues": [1, 2, 3, 4, 5]
}
```

### Response

#### Body

```json
{
  "poolId": 123456,
  "poolValues": [1, 2, 3, 4, 5],
  "status": "inserted" // accepted values: inserted, appended
}
```

## Query Pool

### Request

- URL: http://127.0.0.1:8000/pools/query
- Method: POST

#### Body

```json
{
  "poolId": 1,
  "percentile": 98.5
}
```

### Response

#### Body

```json
{
  "count": 5,
  "percentile": 98.5,
  "quantile": 4.9399999999999995
}
```

# High availability and Scalability

Workers pool for scaling up (within the machine/OS) and handling the incoming requests.

Dependencies:
- node-worker-threads-pool (being used)
- cluster