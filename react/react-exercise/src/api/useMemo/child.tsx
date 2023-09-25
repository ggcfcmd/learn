import { useState, memo } from "react";

const Child = ({ userInfo }: { userInfo: { name: string; age: number } }) => {
  console.log("after state init");

  return (
    <>
      Current name<span>{userInfo.name}</span>
    </>
  );
};

export default memo(Child, (prev, next) => {
  return prev.userInfo === next.userInfo;
});
