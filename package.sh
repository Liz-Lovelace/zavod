#!/bin/bash

zip workerStuff.zip -r worker .env package.json package-lock.json config.mjs

cd prisma
zip transfer-db.zip database.db
cd -
