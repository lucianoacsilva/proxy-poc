import { assert, expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";



describe("MyTokenVulnerable", () => {
    let MyToken: MyToken__factory;
    let MyTokenV2: MyToken__factory;

    describe("Vulnerable contract", () => {
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

        it("Should not pause, since it is not admin", async () => {
            MyToken = await ethers.getContractFactory("MyTokenVulnerable");
            const accounts = await ethers.getSigners();
            const [owner, addr1, addr2] = accounts;

            const proxy = await upgrades.deployProxy(
                MyToken,
                [addr1.address],
                {
                    initializer: "initialize",
                    kind: "uups"
                }
            );

            proxy.connect(addr2);

            await expect(proxy.pause(), "Consider restrict access of method pause").not.to.be.ok;
        });

        it("Should pause, since it is admin", async () => {
            MyToken = await ethers.getContractFactory("MyTokenVulnerable");
            const accounts = await ethers.getSigners();
            const [owner, addr1, addr2] = accounts;

            const proxy = await upgrades.deployProxy(
                MyToken,
                [addr1.address],
                {
                    initializer: "initialize",
                    kind: "uups"
                }
            );

            proxy.connect(addr1);

            await expect(proxy.pause(), "Consider restrict access of method pause").to.be.ok;
        });

        it("Should not authorize upgrade, since it is not admin", async () => {
            MyToken = await ethers.getContractFactory("MyTokenVulnerable");
            MyTokenV2 = await ethers.getContractFactory("MyToken");

            const accounts = await ethers.getSigners();
            const [owner, addr1, addr2] = accounts;

            const proxy = await upgrades.deployProxy(
                MyToken,
                [addr1.address],
                {
                    initializer: "initialize",
                    kind: "uups"
                }
            );

            proxy.connect(addr2);

            await expect(
                upgrades.upgradeProxy(await proxy.getAddress(), MyTokenV2), 
                "Consider restrict access for upgrade authorization method"
            ).not.to.be.ok;
        });

        it("Should authorize upgrade, since it is admin", async () => {
            MyToken = await ethers.getContractFactory("MyTokenVulnerable");
            MyTokenV2 = await ethers.getContractFactory("MyToken");

            const accounts = await ethers.getSigners();
            const [owner, addr1, addr2] = accounts;

            const proxy = await upgrades.deployProxy(
                MyToken,
                [addr1.address],
                {
                    initializer: "initialize",
                    kind: "uups"
                }
            );

            proxy.connect(addr1);

            await expect(
                upgrades.upgradeProxy(await proxy.getAddress(), MyTokenV2), 
                "Consider restrict access for upgrade authorization method"
            ).to.be.ok;
        });

    });

}); 
