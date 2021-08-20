import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
    }
  }
`;

export default function useMe() {
  const hasToken = useReactiveVar(isLoggedInVar);
  // console.log(`hasToken : ${hasToken}`);
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
  });
  //FIXME:
  useEffect(() => {
    if (data?.me === null) {
      // logUserOut();
    }
  }, [data]);
  return { data };
}
