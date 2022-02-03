echo "start deploy =======>"
kubectl rollout restart deployment/notify-service -n production
echo '=====>deploy success'