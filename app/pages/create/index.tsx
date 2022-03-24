import React, { useEffect } from "react";
import classes from "./Create.module.scss";

import {
  TextInput,
  Button,
  Group,
  Box,
  Textarea,
  NumberInput,
  Select,
} from "@mantine/core";
import NFT, { NFTTypes } from "../../components/NFT";
import { useWeb3 } from "../../hooks/useWeb3";
import { getContractAddress } from "../../hooks/useContract";

const Create = () => {
  const [preview, setPreview] = React.useState<NFTTypes>({
    owner: "",
    item: {
      image: "",
      title: "",
      value: "",
      currency: "",
      address: "",
    },
  });

  const { connectedAddress, showWallet, chainId } = useWeb3();

  useEffect(() => {
    if (connectedAddress) {
      const run = async () => {
        const NFTAddress = getContractAddress(chainId, "NFT");
        setPreview((p) => ({
          ...p,
          owner: connectedAddress,
          item: {
            ...p.item,
            address: NFTAddress,
          },
        }));
      };
      run();
    } else {
      showWallet(true);
    }
  }, [connectedAddress, chainId]);

  const handleUpdate = (
    _key: keyof typeof preview["item"],
    { target: { value } }: { target: { value?: any } }
  ) => {
    setPreview((p) => ({
      ...p,
      item: {
        ...p.item,
        [_key]: value,
      },
    }));
  };

  return (
    <div className={classes.root}>
      <h1>Create Your NFT</h1>
      <div className={classes.forms}>
        <div className={classes.preview}>
          <NFT nft={preview} disabled />
        </div>
        <Box sx={{ maxWidth: 1000, minWidth: 400 }} mx="auto">
          <form onSubmit={() => {}}>
            <TextInput
              required
              label="Title"
              onChange={(e) => {
                handleUpdate("title", e);
              }}
              value={preview.item.title}
              placeholder="Funky Title here!"
            />
            <Textarea
              label="Description"
              placeholder="Tell us about this piece!"
              onChange={(e) => {
                handleUpdate("description", e);
              }}
              value={preview.item.description}
            />
            <TextInput
              required
              disabled
              label="Wallet Address"
              value={preview.item.address}
            />
            <TextInput
              required
              label="Image link"
              placeholder="https://example.com/image.png"
              onChange={(e) => {
                handleUpdate("image", e);
              }}
              value={preview.item.image}
            />
            <TextInput
              label="Video link"
              placeholder="https://example.com/video.mp4"
              onChange={(e) => {
                handleUpdate("video", e);
              }}
              value={preview.item.video}
            />
            <NumberInput
              required
              label="Value"
              placeholder="0"
              precision={3}
              min={0}
              onChange={(e) => {
                handleUpdate("value", { target: { value: e } });
              }}
              value={preview.item.value as any}
            />
            <Select
              required
              label="Currency"
              defaultValue={"ETH"}
              data={["ETH", "MATIC", "USDT"]}
              onChange={(e) => {
                handleUpdate("currency", { target: { value: e } });
              }}
              value={preview.item.currency}
            />
            <Group position="right" mt="lg">
              <Button type="submit">Submit and Mint!</Button>
            </Group>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default Create;
