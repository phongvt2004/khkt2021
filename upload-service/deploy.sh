echo "start deploy =======>"
kubectl rollout restart deployment/upload-service -n production
echo '=====>deploy success'