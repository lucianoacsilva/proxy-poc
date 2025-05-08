import { assert, expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";



describe("MyToken", () => {
    let MyToken: MyToken__factory;
    let myToken: MyToken;



    describe("Deploying contract", () => {
        it("Should reject since it has the same address", async () => {
            MyToken = await ethers.getContractFactory("MyTokenVulnerable");
            const accounts = await ethers.getSigners();
            const [owner, addr1, addr2] = accounts;

            expect(
                await upgrades.deployProxy(
                    MyToken,
                    [owner.address],
                    {
                        initializer: "initialize",
                        kind: "uups"
                    }
                ),
                "Deployer can be the owner of contract. Consider restrict the address"
            ).not.to.be.ok;

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
                },
            )).to.be.ok;
        });

        it("Should reject since it has the same address", async () => {
            MyToken = await ethers.getContractFactory("MyTokenVulnerable");
            const accounts = await ethers.getSigners();
            const [owner, addr1, addr2] = accounts;

            
                await upgrades.deployProxy(
                    MyToken,
                    [addr1.address],
                    {
                        initializer: "initialize",
                        kind: "uups"
                    }
                );

                
                
        });

    });

}); 
