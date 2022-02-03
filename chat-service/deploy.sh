echo "start deploy =======>"
kubectl rollout restart deployment/chat-service -n production
echo '=====>deploy success'