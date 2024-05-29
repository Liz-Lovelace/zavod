Tidbits:
- to measure the impact of cores, run
npx remotion benchmark src/index.jsx --concurrencies 1,2,4,8

on a $130 vultr server, that gives us:
1: 16s
2: 10s
4: 7s
8: 6s

Resources:
- Guide to setting up AWS
https://www.remotion.dev/docs/lambda/setup

npx prisma generate
npx prisma db push
