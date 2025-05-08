import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";



describe("MyToken", () => {
    let MyToken: MyToken__factory;
    let myToken: MyToken;



    describe("Deploying contract", () => {
        it("Should reject since it has the same address", async () => {
            MyToken = await ethers.getContractFactory("MyToken");
            const accounts = await ethers.getSigners();
            const [owner, addr1, addr2] = accounts;

            await expect(
                upgrades.deployProxy(
                    MyToken,
                    [owner.address],
                    {
                        initializer: "initialize",
                        kind: "uups"
                    }
                )
            ).to.be.revertedWith('Address of the owner must be different from the sender!');
        });

        it("Should deploy since addresses are different", async () => {
            MyToken = await ethers.getContractFactory("MyToken");
            const accounts = await ethers.getSigners();
            const [owner, addr1, addr2] = accounts;

            expect(await upgrades.deployProxy(
                MyToken,
                [addr1.address],
                {
                    initializer: "initialize",
                    kind: "uups"
                }
            )).not.to.be.null;
        });

    });

}); 
