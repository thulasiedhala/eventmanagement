#!/usr/bin/env bash
# simplified wait-for-it (waits up to 60s by default)
hostport="$1"
shift
cmd="$@"

if [ -z "$hostport" ]; then
  echo "Usage: wait-for-it.sh host:port -- command"
  exit 1
fi

host="${hostport%%:*}"
port="${hostport##*:}"

timeout=60
end=$((SECONDS + timeout))

echo "Waiting for $host:$port (timeout ${timeout}s)..."
while ! (echo > /dev/tcp/"$host"/"$port") 2>/dev/null; do
  if [ $SECONDS -ge $end ]; then
    echo "Timeout waiting for $host:$port"
    exit 1
  fi
  sleep 1
done

echo "$host:$port is available — running command"
exec $cmd
