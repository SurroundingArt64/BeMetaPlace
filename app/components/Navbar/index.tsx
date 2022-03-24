import React, { useEffect, useState } from "react";
import classes from "./Navbar.module.scss";
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
  Burger,
} from "@mantine/core";
import { Search, ArrowRight, ArrowLeft } from "tabler-icons-react";
import { useBooleanToggle } from "@mantine/hooks";
import Link from "next/link";
import { useWeb3 } from "../../hooks/useWeb3";
import Wallet from "../wallet/Wallet";
import { useRouter } from "next/router";

const Navbar = (props: TextInputProps) => {
  const theme = useMantineTheme();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const { showWallet, wallet, connectedAddress } = useWeb3();
  const [awaitRedirect, setAwaitRedirect] = useState<string>();
  const { push } = useRouter();
  useEffect(() => {
    if (awaitRedirect && connectedAddress) {
      push(awaitRedirect);
      setAwaitRedirect(undefined);
    }
  }, [awaitRedirect, connectedAddress]);
  return (
    <div className={classes.root}>
      {wallet && (
        <Wallet
          outerClick={() => {
            showWallet(false);
          }}
        ></Wallet>
      )}{" "}
      <div className={classes.container}>
        <Link href="/">
          <div className={classes.logo}>
            be<span>meta</span>place
          </div>
        </Link>
        <TextInput
          icon={<Search size={18} />}
          radius="xl"
          size="sm"
          rightSection={
            <ActionIcon size={24} radius="xl" color="yellow" variant="filled">
              {theme.dir === "ltr" ? (
                <ArrowRight size={12} color="black" />
              ) : (
                <ArrowLeft size={12} color="black" />
              )}
            </ActionIcon>
          }
          placeholder="Search..."
          rightSectionWidth={38}
          className={classes.search}
          {...props}
        />
        <ul>
          <li
            onClick={() => {
              if (!connectedAddress) {
                showWallet(true);
              }
              setAwaitRedirect("create");
            }}
            data-type="create"
          >
            Create
          </li>

          <Link href="/">
            <li>Marketplace</li>
          </Link>
          <li
            onClick={() => {
              if (!connectedAddress) showWallet(true);
            }}
          >
            {connectedAddress
              ? connectedAddress.slice(0, 5) +
                "..." +
                connectedAddress.slice(connectedAddress.length - 4)
              : "Wallet"}
          </li>
        </ul>
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          size="sm"
          color="white"
          className={classes.burger}
        />
      </div>
    </div>
  );
};

export default Navbar;
