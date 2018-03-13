case $1 in
1)
  message="One!"
  ;;
2)
  message="Two!"
  ;;
3)
  message="Three!"
  ;;
4)
  message="Four!"
  ;;
*)
  message="Out of range"
  ;;
esac

echo $message