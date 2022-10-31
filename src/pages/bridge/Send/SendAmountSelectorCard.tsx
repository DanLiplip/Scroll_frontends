// /* eslint-disable */
import { useMemo, FC, ChangeEvent } from "react";
import { BigNumber } from "ethers";
import { makeStyles } from "tss-react/mui";
import { Card, Typography, Skeleton, MenuItem } from "@mui/material";
import LargeTextField from "../components/LargeTextField";
import RaisedSelect from "../components/RaisedSelect";
import SelectOption from "../components/RaisedSelect/SelectOption";
import { toTokenDisplay } from "@/utils";
import { tokens } from "@/constants/networks";

import NetworkSelector from "./NetworkSelector";
import SelectedToken from "./SelectedToken";

type Props = {
  value?: string;
  label: string;
  token?: any;
  onChange?: (value: string) => void;
  fromNetwork?: any;
  toNetwork?: any;
  selectedNetwork?: any;
  networkOptions: any[];
  onNetworkChange?: (network?: any) => void;
  balance?: BigNumber;
  loadingBalance?: boolean;
  disableInput?: boolean;
  deadline?: any;
  setWarning?: (message: string) => void;
  handleBridgeChange?: (event: ChangeEvent<{ value: unknown }>) => void;
};

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      width: "100%",
      boxSizing: "border-box",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        padding: "1.6rem",
      },
      backgroundColor: theme.palette.background.default,
      boxShadow: "0px 2px 4px rgba(0,0,0,.1)",
      transition: "all 0.15s ease-out",
    },
    selectItem: {
      "&.Mui-selected": {
        backgroundColor: "rgba(201, 203, 206, 0.2)",
        "&:hover, &:focus": {
          backgroundColor: "rgba(201, 203, 206, 0.2)",
        },
      },
      ".MuiTypography-root": {
        cursor: "pointer",
      },
      [theme.breakpoints.down("sm")]: {
        minHeight: "3.8rem",
      },
    },
    topRow: {
      marginBottom: "1.8rem",
    },
    networkSelectionBox: {
      display: "flex",
      alignItems: "center",
      transition: "all 0.15s ease-out",
    },
    networkLabel: {
      display: "flex",
      flexDirection: "row",
      marginLeft: "0.4rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    networkIconContainer: {
      display: "flex",
      justifyContent: "center",
      width: "4rem",
      height: "4rem",
    },
    networkIcon: {
      display: "flex",
      height: "2.2rem",
      margin: "0.7rem",
    },
    balance: {
      display: "flex",
      alignItems: "center",
    },
    maxButton: {
      width: "5rem",
      height: "3rem",
      lineHeight: "3rem",
      textAlign: "center",
      borderRadius: "2rem",
      fontSize: "1.4rem",
      marginLeft: "1.4rem",
      cursor: "pointer",
      fontWeight: 600,
      border: "none",
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.main,
    },
  };
});

const SendAmountSelectorCard: FC<Props> = (props) => {
  const {
    value = "",
    label = "from",
    token,
    onChange,
    selectedNetwork,
    onNetworkChange,
    balance,
    loadingBalance = false,
    disableInput = false,
    handleBridgeChange,
  } = props;
  const { classes } = useStyles();

  const balanceLabel = useMemo(() => {
    return toTokenDisplay(balance, token?.decimals);
  }, [balance, token]);

  const isToCard = useMemo(() => label === "To", [label]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange?.(value);
  };

  return (
    <Card className={classes.container}>
      <div className="flex justify-between items-center w-full">
        {isToCard ? (
          <div></div>
        ) : (
          <LargeTextField
            className="flex-1"
            value={value}
            onChange={handleInputChange}
            placeholder="0.00"
            leftAlign
            disabled={disableInput}
          />
        )}

        {isToCard ? (
          <SelectedToken icon={token.TokenImage}>{token.symbol}</SelectedToken>
        ) : (
          <RaisedSelect value={token.symbol} onChange={handleBridgeChange}>
            {Object.keys(tokens).map((token) => (
              <MenuItem
                value={token}
                key={token}
                className={classes.selectItem}
              >
                <SelectOption
                  value={token}
                  icon={tokens[token].TokenImage}
                  label={token}
                />
              </MenuItem>
            ))}
          </RaisedSelect>
        )}
      </div>
      <div className="flex justify-between items-center w-full mt-4">
        <NetworkSelector
          network={selectedNetwork}
          setNetwork={onNetworkChange}
        />
        {loadingBalance ? (
          <Skeleton variant="text" width="15.0rem"></Skeleton>
        ) : balance ? (
          <div className="flex items-center justify-end">
            <Typography variant="subtitle2" color="textSecondary" align="right">
              Balance: {balanceLabel}
            </Typography>
            {/* {balance.gt(0) && !disableInput ? (
              <button
                className={styles.maxButton}
                onClick={handleMaxClick}
                title="Max amount you can send while still having enough to cover fees"
              >
                MAX
              </button>
            ) : null} */}
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default SendAmountSelectorCard;
