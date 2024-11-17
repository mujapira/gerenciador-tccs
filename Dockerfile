ARG MONGO_VERSION

FROM mongo:${MONGO_VERSION}

ENTRYPOINT mongod --port $MONGO_REPLICA_PORT --replSet rs0 --bind_ip 0.0.0.0 & MONGOD_PID=$!; \
# Check if the replica set is already initialized
CHECK_REPL_CMD="rs.status().ok || rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '$MONGO_REPLICA_HOST:$MONGO_REPLICA_PORT' }] })"; \
# Wait for MongoDB to be ready and then execute the replica set command if not already initialized
until ($MONGO_COMMAND admin --port $MONGO_REPLICA_PORT --eval "$CHECK_REPL_CMD"); do sleep 1; done; \
# Keep the container running by waiting on the mongo process
echo "REPLICA SET ONLINE"; wait $MONGOD_PID;