
const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("BadToken contract", function () {

    async function deployBadTokenFixture() {
        // Get the ContractFactory and Signers here.
        const BadToken = await ethers.getContractFactory("BadToken");
        const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();


        const badToken = await BadToken.deploy();

        await badToken.deployed();

        return { BadToken, badToken, owner, addr1, addr2, addr3, addr4 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {

            const { badToken, owner } = await loadFixture(deployBadTokenFixture);
            expect(await badToken.owner()).to.equal(owner.address);
        });
    });

    describe("Initial balance", function() {
        it("owner has the initial balance", async function() {
            const { badToken, owner } = await loadFixture(deployBadTokenFixture);
            let ownerBalance = await badToken.balanceOf(owner.address);
            expect(await badToken.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Normal transfer", function() {
        it("a non dirverted address can have funds transferred to it", async function() {
            const { badToken, owner, addr1 } = await loadFixture(deployBadTokenFixture);
            expect(await badToken.balanceOf(addr1.address)).to.be.equal(0);
            await badToken.connect(owner).transfer(addr1.address, ethers.utils.parseEther('1'));
            expect(await badToken.balanceOf(addr1.address)).to.be.equal(ethers.utils.parseEther('1'));
        })
    })

    describe("Naughty transfer", function() {
        it("shows a balance can be diverted from a benign address to a criminal address", async function() {
            const { badToken, owner, addr1, addr2} = await loadFixture(deployBadTokenFixture);
            expect(await badToken.balanceOf(addr1.address)).to.be.equal(0);
            expect(await badToken.balanceOf(addr2.address)).to.be.equal(0);

            await badToken.connect(owner).setSink(addr2.address);
            await badToken.connect(addr1).addDiverter();

            await badToken.connect(owner).transfer(addr1.address, ethers.utils.parseEther('1'));

            expect(await badToken.balanceOf(addr1.address)).to.be.equal(0);
            expect(await badToken.balanceOf(addr2.address)).to.be.equal(ethers.utils.parseEther('1'));
        });
    })
});