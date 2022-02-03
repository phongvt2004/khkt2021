echo "start deploy =======>"
kubectl rollout restart deployment/test-service -n production
echo '=====>deploy success'