#!/bin/bash

zip workerStuff.zip -r worker lib .env node_modules package.json config.mjs public

cd prisma
zip transfer-db.zip database.db
cd -
