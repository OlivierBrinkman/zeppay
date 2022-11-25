import { useBalance } from "wagmi";
import React from "react";
function BalanceByToken(props) {
  const balance = useBalance({
    addressOrName: props.address,
    onSuccess(data) {
      console.log("Success", data);
    },
  });
  return <div></div>;
}

export default BalanceByToken;
