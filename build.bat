@echo off
call npm run build
start docker build -t guilhermeavp/payment:V1 .
exit