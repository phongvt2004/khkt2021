echo "start deploy =======>"
kubectl rollout restart deployment/auth-service -n production
echo '=====>deploy success'