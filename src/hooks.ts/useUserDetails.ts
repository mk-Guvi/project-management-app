import { useEffect } from "react";
import useUserDetailsStore from "../store/userDetailsStore";

const useUserDetails = (props?: { preventInitialCall?: boolean }) => {
  const { userDetails, updateUserDetails, fetchUserDetails, isLoading } =
    useUserDetailsStore();

  useEffect(() => {
    if (!props?.preventInitialCall && !userDetails) {
      fetchUserDetails();
    }
  }, [userDetails, props?.preventInitialCall, fetchUserDetails]);

  return {
    userDetails,
    isLoading,
    updateUserDetails,
    fetchUserDetails
  };
};

export default useUserDetails;
