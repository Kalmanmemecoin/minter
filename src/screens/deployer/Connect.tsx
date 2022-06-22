import BaseButton from "components/BaseButton";
import Screen from "components/Screen";
import React, { useEffect, useState } from "react";
import HeroImg from "assets/connect.png";
import { styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "consts";
import ConnectPopup from "components/connect-popup";

const StyledImage = styled("img")({
  width: 474,
  height: 346,
  marginBottom: 23,
  marginTop: 23,
  objectFit:'contain',
  '@media (max-height: 830px)': {
    width: 374,
    height: 246,
  }
});

const StyledContainer = styled(Box)(({theme}) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: '70px 0px 70px 0px',
  '@media (max-height: 830px)': {
    padding: '30px 0px 30px 0px',
  }
  
}));

const StyledIcon = styled(Box)({
  fontSize: 30,
});


const StyledHeader = styled(Box)({
  display:'flex',
  alignItems:'center',
  flexDirection:'column',
  gap:5,
  "& h3":{
    fontSize: 28,
    fontWeight: 600,
  },
  "& p": {
    fontSize: 16
  }
})

function ConnectScreen() {
  const [showConnect, setShowConnect] = useState(false);
  const { address } = useConnectionStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      navigate(ROUTES.deployer);
    }
  }, [address]);

  return (
    <Screen>
      <StyledContainer>
        <StyledHeader>
        <Typography variant="h3">An open source tool to create jettons</Typography>
        </StyledHeader>
       
        <StyledImage src={HeroImg} />
        <BaseButton
          minWidth={344}
          onClick={() => setShowConnect(true)}
        >
          Connect wallet
        </BaseButton>
      </StyledContainer>
      <ConnectPopup open={showConnect} onClose={() => setShowConnect(false)} />
    </Screen>
  );
}

export { ConnectScreen };