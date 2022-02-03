echo "start deploy =======>"
kubectl rollout restart deployment/user-service -n production
echo '=====>deploy success'