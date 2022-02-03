echo "start deploy =======>"
kubectl rollout restart deployment/member-service -n production
echo '=====>deploy success'