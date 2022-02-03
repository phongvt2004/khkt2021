echo "start deploy =======>"
kubectl rollout restart deployment/ques-service -n production
echo '=====>deploy success'