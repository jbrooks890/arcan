import { useState } from "react";

export default function useDBMaster() {
  const [arcanData, setArcanData] = useState();

  return { arcanData, setArcanData };
}
