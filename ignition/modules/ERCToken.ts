import {buildModule} from "@nomicfoundation/hardhat-ignition/modules"

const ERCTokenModule = buildModule("ERCTokenModule", (m) => {

    const erc20 = m.contract("ERCToken");

    return { erc20 };
});

export default ERCTokenModule;
