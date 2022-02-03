echo "start deploy =======>"
kubectl rollout restart deployment/group-service -n production
echo '=====>deploy success'