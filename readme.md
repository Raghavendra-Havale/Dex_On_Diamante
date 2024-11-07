The project leverages Diamante’s SDK to create a streamlined DEX functionality. By using operations like create trustlines, manage offers, path payments, and liquidity pool management, this code facilitates trading between assets without intermediaries. Users can buy and sell a custom asset (TradeToken) issued by one account, establish liquidity, and execute multi-hop payments.
Features

    Dynamic Account Creation: Generates keypairs for the issuer, distributor, and buyer accounts.
    Trustline Management: Establishes trustlines dynamically, allowing any account to trust specific assets.
    Asset Issuance: Issues TradeToken from the issuer to the distributor.
    Offer Management: Creates buy/sell offers to simulate DEX trading.
    Path Payments: Enables asset conversion with multi-hop payment support.
    Liquidity Pool Operations (Placeholders): Includes deposit and withdraw functions to add/remove liquidity, which are placeholders requiring a valid pool ID.

Code Breakdown

1. Setup and Account Initialization

   Three accounts are created:
   Issuer: The account issuing TradeToken.
   Distributor: The account initially receiving TradeToken.
   Buyer: The account intending to purchase TradeToken.
   Each account is funded via Diamante’s Friendbot for testing on the testnet.

2. Establishing Trustlines

The establishTrustline function enables any account to trust a specified asset dynamically by passing in a secret key. The code uses this function to set up:

    Distributor Trustline: Allows the distributor to hold TradeToken.
    Buyer Trustline: Allows the buyer to hold TradeToken before making buy offers.

3. Issuing Custom Asset (TradeToken)

   The issuer sends 500 units of TradeToken to the distributor.
   This transaction uses the Diamante payment operation and is signed by the issuer.

4. Managing Offers

   Sell Offer: The distributor places a sell offer for 100 units of TradeToken at a rate of 0.5 DIAM per token.
   Buy Offer: After setting up a trustline, the buyer places a buy offer for 10 units of TradeToken at the same rate.
   Offers use Diamante’s manageSellOffer and manageBuyOffer operations, with dynamically assigned offer IDs.

5. Path Payments

The project includes two path payment functions that enable conversion between assets with flexibility in specifying the amount to send or receive.

    Path Payment Strict Send: Sends 10 DIAM, converting it into a minimum of 5 units of TradeToken.
    Path Payment Strict Receive: Attempts to receive 10 units of TradeToken, with a maximum of 15 DIAM sent for conversion.
    Each function defines a path ([DIAM, TradeToken]) to facilitate the asset conversion.

6. Liquidity Pool Operations (Placeholders)

Placeholder functions for liquidity pool deposit and withdrawal operations are included. These require a valid liquidity pool ID and would enable the following:

    Deposit: Adds DIAM and TradeToken into the pool, receiving pool share tokens in exchange.
    Withdraw: Burns pool share tokens, redeeming DIAM and TradeToken from the pool.

7. Error Handling and Transaction Hash Logging

Each transaction logs its hash upon successful execution for tracking purposes. Comprehensive error handling provides detailed error messages for debugging.
Implementation Details
Technology Stack

    Diamante SDK: Used for blockchain operations, account creation, trustlines, offers, payments, and liquidity management.
    Node.js: JavaScript runtime for asynchronous operations and API requests.
    Friendbot: Diamante testnet funding utility to initialize test accounts.

Prerequisites

    Node.js (v12 or later)
    Diamante Testnet Access: The code runs on Diamante’s testnet.

Running the Code

    Clone the Repository

git clone https://github.com/Raghavendra-Havale/Dex_On_Diamante.git
cd diamante-dex

Install Dependencies

npm install diamnet-sdk node-fetch

Run the Script

    node script.js

This will execute the full DEX flow, outputting transaction hashes and statuses for each operation.

Result will look something like this:

```
Issuer Public Key: GDH456MWXKESSDDNXFV7NATVS3EZXRLEUE5JIMFNNO2DW2XPQ4UGAUFP
Distributor Public Key: GBPP4MW2HTRDF6CCT6GRI7KXEPCXWYXZICVFTOOLKIEQ6QHTPNEWZC7F
Buyer Public Key: GAAKYTZM6FNJ6SL72UKRFDVVAUAGMZSKCKY4VRHZOMMB3RMQJOKMV3KC
Account GDH456MWXKESSDDNXFV7NATVS3EZXRLEUE5JIMFNNO2DW2XPQ4UGAUFP funded.
Account GBPP4MW2HTRDF6CCT6GRI7KXEPCXWYXZICVFTOOLKIEQ6QHTPNEWZC7F funded.
Trustline established for GBPP4MW2HTRDF6CCT6GRI7KXEPCXWYXZICVFTOOLKIEQ6QHTPNEWZC7F.
Transaction Hash: b64469030615a3e55d64336628cc83a5ca7d1e74bc7f79e6239ed914f60939bb
Asset issued to distributor.
Transaction Hash: 22e609a91c0fae7761c43c972eefb2cf1cdf6ec6f938029fcc6ae14782a887e5
Sell offer created.
Transaction Hash: 5f8a31161d95e837dd0ff9b9ec7200d223d0f094ff1f3176694c80e6172d9fcd
Account GAAKYTZM6FNJ6SL72UKRFDVVAUAGMZSKCKY4VRHZOMMB3RMQJOKMV3KC funded.
Trustline established for GAAKYTZM6FNJ6SL72UKRFDVVAUAGMZSKCKY4VRHZOMMB3RMQJOKMV3KC.
Transaction Hash: 7790362d41ca7bde3d367cd320c7852d9e522dccf907f4b3bb47cd2516b8d72f
Buy offer created.
Transaction Hash: edc8e2018041afb4d085f848b295d7395e5b1868d928364fcaeb3e57058ccd15
Path Payment Strict Send executed.
Transaction Hash: b6f8d60757517f369e5daa48ec212358c80fc025d932d9e96cbe3f7009fb5488
Path Payment Strict Receive executed.
Transaction Hash: f6d4db50b20428990bb3f1fffd4d3c922344c79e7800962fb7f0267a71fee9cf
DEX flow executed successfully.
```
