import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";

interface IParams extends ParsedUrlQuery {
  address?: string;
}

const Collection: React.FC = () => {
  const router = useRouter();
  const [collectionAddress, setCollectionAddress] = useState<string>();
  useEffect(() => {
    const query = router.query as IParams;
    if (query.address) {
      setCollectionAddress(query.address);
    }
  }, [router]);
  return <div>Collection: {collectionAddress}</div>;
};

export default Collection;
