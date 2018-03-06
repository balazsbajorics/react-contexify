
#!/usr/bin/env bash
set -euo pipefail

npm run prebuild &&
npm run prestyle &&
npm run style &&
NODE_ENV=production npm run bundle && NODE_ENV=production ./node_modules/.bin/babel --ignore=__tests__ src -d lib
