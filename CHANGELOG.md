# [2.2.0](https://github.com/PolymeshAssociation/polymesh-wallet/compare/2.1.0...2.2.0) (2024-12-09)


### Bug Fixes

* update loading animation ([866123f](https://github.com/PolymeshAssociation/polymesh-wallet/commit/866123f88bac06c51695e6b72372ec9214f5ba7d))


### Features

* include steps to connect  a ledger device in the signing flow if not connected ([5a28506](https://github.com/PolymeshAssociation/polymesh-wallet/commit/5a285061cdce5313253c1a820eceb52f800a2231))
* remove the ping messages from PolymeshInjected ([edf381f](https://github.com/PolymeshAssociation/polymesh-wallet/commit/edf381f4eb6035af81dabff286f3abb516be5d50))
* show protocol fees for nested calls + bump SDK and Polymesh types dependencies ([c1d3967](https://github.com/PolymeshAssociation/polymesh-wallet/commit/c1d39678af4ddaf865286072409f0a9521e59f0b))

# [2.1.0](https://github.com/PolymeshAssociation/polymesh-wallet/compare/2.0.3...2.1.0) (2024-10-23)


### Bug Fixes

* update github action ([0b0e40d](https://github.com/PolymeshAssociation/polymesh-wallet/commit/0b0e40df2bb95f9a2de20b0b355e6ee607926a86))
* use github actions/upload-artifact@v4 ([e57751e](https://github.com/PolymeshAssociation/polymesh-wallet/commit/e57751ead548b8cfeb36563f168e7235789c6ec6))


### Features

* add dual compatibility with polymesh v6 and v7 ([e51f12d](https://github.com/PolymeshAssociation/polymesh-wallet/commit/e51f12d3d2271e428353dd6191ebeb76d4dd3b50))

## [2.0.3](https://github.com/PolymeshAssociation/polymesh-wallet/compare/2.0.2...2.0.3) (2024-08-28)


### Bug Fixes

* store did key addresses in the default SS58 format used by the keyring ([7f1425a](https://github.com/PolymeshAssociation/polymesh-wallet/commit/7f1425aaba1a24906ed6f4bc09376cd73a7933c4))

## [2.0.2](https://github.com/PolymeshAssociation/polymesh-wallet/compare/2.0.1...2.0.2) (2024-08-28)


### Bug Fixes

* update README ([c9f101d](https://github.com/PolymeshAssociation/polymesh-wallet/commit/c9f101d8d4f2173eb2a110cb5f318b34109861ed))

## [2.0.1](https://github.com/PolymeshAssociation/polymesh-wallet/compare/2.0.0...2.0.1) (2024-08-27)


### Bug Fixes

* update bump-versions.sh to work with yarn@4.4.0 ([7e32b13](https://github.com/PolymeshAssociation/polymesh-wallet/commit/7e32b13e369e1ab684b72fb4e57c09b4680d148d))

# [2.0.0](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.8.3...2.0.0) (2024-08-27)


### Bug Fixes

* enable corepack ([f8a0391](https://github.com/PolymeshAssociation/polymesh-wallet/commit/f8a03918b368d331555a463f0fca6720356ec13a))


### Features

* migrate to Manifest V3 and align with upstream polkadot extension ([5d7198d](https://github.com/PolymeshAssociation/polymesh-wallet/commit/5d7198dc97874bb28089ada602b85d7944ed8774))


### BREAKING CHANGES

* Updated Polymesh wallet to support Manifest V3, with significant updates aligning configurations, dependencies, and architecture to match upstream polkadot wallet. This may affect compatibility with environments relying on Manifest V2.

## [1.8.3](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.8.2...1.8.3) (2024-04-05)


### Bug Fixes

* update to correct staging endpoint ([e44bd78](https://github.com/PolymeshAssociation/polymesh-wallet/commit/e44bd78b675e555d5030d0b3604070df8286bc34))

## [1.8.2](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.8.1...1.8.2) (2024-01-25)


### Bug Fixes

* prevent authorization requests from incorrect url when pages are pre-rendered ([75a42ed](https://github.com/PolymeshAssociation/polymesh-wallet/commit/75a42edb97a80b7ed8c5c5eda2875ccf72935afe))

## [1.8.1](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.8.0...1.8.1) (2024-01-02)


### Bug Fixes

* fixed identity rename props ([2139d02](https://github.com/PolymeshAssociation/polymesh-wallet/commit/2139d02a261729bb4fc28aaa63d8ac200f74aa8b))
* fixed identity state slice for store identities by account and did ([76d7a6f](https://github.com/PolymeshAssociation/polymesh-wallet/commit/76d7a6f6f4a9b94023a063cccc72b5c71ee7a818))
* multiple fixes ([4b29316](https://github.com/PolymeshAssociation/polymesh-wallet/commit/4b29316bcd6316942cf63aed109d6e9819f0f7ab))
* remove network specific account states ([2969fb1](https://github.com/PolymeshAssociation/polymesh-wallet/commit/2969fb155cbe861f6515bf4125725b6e819b72b9))

# [1.8.0](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.9...1.8.0) (2023-10-27)


### Bug Fixes

* ability to unsubscribe from network ([75162b7](https://github.com/PolymeshAssociation/polymesh-wallet/commit/75162b7890aaa543de1ecfd8865a79ef561ac227))
* add trailing slash to local dashboard link ([072d3e7](https://github.com/PolymeshAssociation/polymesh-wallet/commit/072d3e750522af9032b98d92598a40a84bbe4170))
* do not modify custom endpoint url ([0242f19](https://github.com/PolymeshAssociation/polymesh-wallet/commit/0242f19bf21d00e19bebe366363858c691ca250f))
* identityClaim is now optional - remain backwards compatible ([1c8a197](https://github.com/PolymeshAssociation/polymesh-wallet/commit/1c8a197561e4d41c7f85491143cbb87a10ff4d1c))
* merged develop + fixed conflicts ([faf782c](https://github.com/PolymeshAssociation/polymesh-wallet/commit/faf782c9c33ef1f4bb93741b524d86226c92a77a))
* merged develop + fixed conflicts ([bdf212c](https://github.com/PolymeshAssociation/polymesh-wallet/commit/bdf212cf2766e47a485bd5b9bef9bdb5d763aa48))
* open initial create/import account screens as ([5b52070](https://github.com/PolymeshAssociation/polymesh-wallet/commit/5b52070dfb59551713af915b8c0713f29c677fc6))
* removed unused code ([f4e947f](https://github.com/PolymeshAssociation/polymesh-wallet/commit/f4e947fab03b1588ebf551b351b5ad110b67aebf))
* removed unused code ([f0b182f](https://github.com/PolymeshAssociation/polymesh-wallet/commit/f0b182f5d192a15847f2dfd0d52e4b3b3007f817))
* requested changes ([875a4b6](https://github.com/PolymeshAssociation/polymesh-wallet/commit/875a4b6f06cff322feef62cf511607793edb5691))
* resolve tsc error ([20ed11e](https://github.com/PolymeshAssociation/polymesh-wallet/commit/20ed11ec613dbcd4e12fc93482ea8a80c440f491))
* unsubscribing from keys ([0b5e100](https://github.com/PolymeshAssociation/polymesh-wallet/commit/0b5e1005a668b0e676bdf36e74f048400932b05e))
* update links ([b0198d9](https://github.com/PolymeshAssociation/polymesh-wallet/commit/b0198d97d2ffab515225c21a6a7025768ec0cc23))
* updated networkUrl selector for apiPromis ([02b04cd](https://github.com/PolymeshAssociation/polymesh-wallet/commit/02b04cddaf730b4900edbc81422869f8a0f36e0e))


### Features

* added api promise reload after custom url change ([67c6156](https://github.com/PolymeshAssociation/polymesh-wallet/commit/67c6156f7c6cd882134fb995fe1f8f2cf819bccb))
* added custom rpc functionality ([928127d](https://github.com/PolymeshAssociation/polymesh-wallet/commit/928127d4de7e6d9128bf8144acccec044862013f))
* return wssUrl for custom networks ([17c1503](https://github.com/PolymeshAssociation/polymesh-wallet/commit/17c150372a8f96ad1da87e8e12f898b227ca881a))

## [1.7.9](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.8...1.7.9) (2023-09-08)


### Bug Fixes

* update README ([7d17ea0](https://github.com/PolymeshAssociation/polymesh-wallet/commit/7d17ea0bb60b1edc5a538b0a6c88b1f1a1cbd712))

## [1.7.8](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.7...1.7.8) (2023-09-08)


### Bug Fixes

* add trailing slash to local dashboard link ([a96552e](https://github.com/PolymeshAssociation/polymesh-wallet/commit/a96552e1b80a7dbe18b94a68327e14cac8c442ce))
* identityClaim is now optional - remain backwards compatible ([038622b](https://github.com/PolymeshAssociation/polymesh-wallet/commit/038622beadb077eae96ffcdd40c0d3109bab19a3))

## [1.7.7](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.6...1.7.7) (2023-07-13)


### Bug Fixes

* update links ([4d2e8e6](https://github.com/PolymeshAssociation/polymesh-wallet/commit/4d2e8e6e6643cb95402e16b2d7f27f0bb97491a1))

## [1.7.6](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.5...1.7.6) (2023-07-13)


### Bug Fixes

* open initial create/import account screens as ([8a9e0c9](https://github.com/PolymeshAssociation/polymesh-wallet/commit/8a9e0c9c15bcb2b7f577baefc48ac071605977e8))

## [1.7.5](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.4...1.7.5) (2023-05-31)


### Bug Fixes

* update extension dependencies ([4075919](https://github.com/PolymeshAssociation/polymesh-wallet/commit/407591964a9647203fd066d7aa2d315eefb98c8f))

## [1.7.4](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.3...1.7.4) (2023-05-30)


### Bug Fixes

* update yarn.lock for semantic release ([a3dcc17](https://github.com/PolymeshAssociation/polymesh-wallet/commit/a3dcc1773a773f77e09b16926e6ef5d3edb4420e))

## [1.7.3](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.2...1.7.3) (2023-05-30)


### Bug Fixes

* remove old dependencies ([71e8fc0](https://github.com/PolymeshAssociation/polymesh-wallet/commit/71e8fc07c0556fbc66619f9a96d47454e65e6dd4))

## [1.7.2](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.1...1.7.2) (2023-05-30)


### Bug Fixes

* update whitelist ([914774c](https://github.com/PolymeshAssociation/polymesh-wallet/commit/914774c13baabe8e97d04e89ee2fd7209fe98bf1))

## [1.7.1](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.7.0...1.7.1) (2023-05-30)


### Bug Fixes

* fix fees for Polymesh 5.4 ([ecffd1b](https://github.com/PolymeshAssociation/polymesh-wallet/commit/ecffd1ba3bd2a98e2e08f4e95e242f31ad977fa2))

# [1.7.0](https://github.com/PolymeshAssociation/polymesh-wallet/compare/1.6.3...1.7.0) (2023-04-04)


### Bug Fixes

* add systematic cdd issuers ([21a2990](https://github.com/PolymeshAssociation/polymesh-wallet/commit/21a29900bf01d4782fbed7fce3c03a524258dfb8))
* adjust window to desired inner dimensions ([7767afa](https://github.com/PolymeshAssociation/polymesh-wallet/commit/7767afaa47f17684616eb1d0ddc8e83e81acde6d))
* allow root div fill height when full screen ([d70f172](https://github.com/PolymeshAssociation/polymesh-wallet/commit/d70f172f730532840f97e5ec25bf40cbdc369c79))
* fixes privacy and toc links and verifier DID formatting ([3265cc5](https://github.com/PolymeshAssociation/polymesh-wallet/commit/3265cc5323391ddf57ab278aa51b7a9a9c0e72cf))
* improve variable name ([903fec1](https://github.com/PolymeshAssociation/polymesh-wallet/commit/903fec1722cb065bfee65efc8fe20759647de68d))
* linting ([abc893a](https://github.com/PolymeshAssociation/polymesh-wallet/commit/abc893af6dbfb56c500b36f70f8255f3647a28d9))
* more polymesh association updates ([9d8c070](https://github.com/PolymeshAssociation/polymesh-wallet/commit/9d8c070c5ff75d8681a7e5ba6e829b5084e247de))
* update more polymath refs ([31f7fa8](https://github.com/PolymeshAssociation/polymesh-wallet/commit/31f7fa83840566dfef4f932f741d7365ee08b1c6))
* update to [@polymeshassociation](https://github.com/polymeshassociation) ([955aad8](https://github.com/PolymeshAssociation/polymesh-wallet/commit/955aad8afe37002e35c61d8e561dfe600a5bfd57))


### Features

* add multisig signers ([6ca56a6](https://github.com/PolymeshAssociation/polymesh-wallet/commit/6ca56a605184bf3aad5da60bf0f14865d8612121))

## [1.6.3](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.6.2...1.6.3) (2022-08-12)


### Bug Fixes

* updates for chain v5 [ACORN-554] ([#248](https://github.com/PolymathNetwork/polymesh-wallet/issues/248)) ([e27f857](https://github.com/PolymathNetwork/polymesh-wallet/commit/e27f8575841d8197fceaaf5c197ba5baf938f785))

## [1.6.2](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.6.1...1.6.2) (2022-07-06)


### Bug Fixes

* tsc build issues ([#247](https://github.com/PolymathNetwork/polymesh-wallet/issues/247)) ([cebe2c2](https://github.com/PolymathNetwork/polymesh-wallet/commit/cebe2c2744e6f29f5949567528e0ee1556491a50))

## [1.6.1](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.6.0...1.6.1) (2022-07-05)


### Bug Fixes

* update packages to enable api init ([#246](https://github.com/PolymathNetwork/polymesh-wallet/issues/246)) ([1c6fd20](https://github.com/PolymathNetwork/polymesh-wallet/commit/1c6fd20e3e33fa958bd1acf24d127fb2a0cc63cf))

# [1.6.0](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.5.7...1.6.0) (2022-05-02)


### Features

* add staging network ([#245](https://github.com/PolymathNetwork/polymesh-wallet/issues/245)) ([1ef218c](https://github.com/PolymathNetwork/polymesh-wallet/commit/1ef218cb29d556a757061868792c3671fdec4f24))

## [1.5.7](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.5.6...1.5.7) (2022-03-07)


### Bug Fixes

* switch to appropriate genesis hash ([#244](https://github.com/PolymathNetwork/polymesh-wallet/issues/244)) ([6653fe0](https://github.com/PolymathNetwork/polymesh-wallet/commit/6653fe01f2bbfb3d9901ce319f6794644fac008c))

## [1.5.6](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.5.5...1.5.6) (2022-01-20)


### Bug Fixes

* use localhost link for dashboard for local network [GTN-2372] ([#240](https://github.com/PolymathNetwork/polymesh-wallet/issues/240)) ([456df20](https://github.com/PolymathNetwork/polymesh-wallet/commit/456df2098216ef1ff129738622416002b9b9a8bf))

## [1.5.5](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.5.4...1.5.5) (2022-01-15)


### Bug Fixes

* reset badge on instantiation ([#239](https://github.com/PolymathNetwork/polymesh-wallet/issues/239)) ([b8a6df4](https://github.com/PolymathNetwork/polymesh-wallet/commit/b8a6df4a9bf53860ff399f6ec1d5d8dd473dcb31))

## [1.5.4](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.5.3...1.5.4) (2021-12-08)


### Bug Fixes

* remove tooling and staging networks [GTN-2317] ([#237](https://github.com/PolymathNetwork/polymesh-wallet/issues/237)) ([29d33de](https://github.com/PolymathNetwork/polymesh-wallet/commit/29d33dea5f23a25410c1b1e63dc055806ee2c2d8))

## [1.5.3](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.5.2...1.5.3) (2021-12-07)


### Bug Fixes

* more detailed wording ([#235](https://github.com/PolymathNetwork/polymesh-wallet/issues/235)) ([a4ab75a](https://github.com/PolymathNetwork/polymesh-wallet/commit/a4ab75a5517ae2cba213c6cec1f28dbd92ec617d))

## [1.5.2](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.5.1...1.5.2) (2021-12-03)


### Bug Fixes

* revert "disable signing if insufficient balance [GTN-2297] [GTN-2162] ([#236](https://github.com/PolymathNetwork/polymesh-wallet/issues/236))" ([374e254](https://github.com/PolymathNetwork/polymesh-wallet/commit/374e254ce6e7d27e398de25d55a57e1ce6ba1088))

## [1.5.1](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.5.0...1.5.1) (2021-12-03)


### Bug Fixes

* disable signing if insufficient balance [GTN-2297] [GTN-2162] ([#236](https://github.com/PolymathNetwork/polymesh-wallet/issues/236)) ([2adb2eb](https://github.com/PolymathNetwork/polymesh-wallet/commit/2adb2ebdcf01147d4f9afa7a7ee9baaf078dd09d))

# [1.5.0](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.4.2...1.5.0) (2021-11-23)


### Features

* connect to Mainnet by default on wallet installation ([#234](https://github.com/PolymathNetwork/polymesh-wallet/issues/234)) ([75bbb2b](https://github.com/PolymathNetwork/polymesh-wallet/commit/75bbb2b6138e4c322d0cb83af8fbcce610960e0d))

## [1.4.2](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.4.1...1.4.2) (2021-11-18)


### Bug Fixes

* issues in Import Ledger account popup ([#233](https://github.com/PolymathNetwork/polymesh-wallet/issues/233)) ([8e83755](https://github.com/PolymathNetwork/polymesh-wallet/commit/8e8375521c3118a2c1857a4c34156592a3df3d2a))

## [1.4.1](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.4.0...1.4.1) (2021-11-17)


### Bug Fixes

* genesis hash issues with Ledger devices ([#232](https://github.com/PolymathNetwork/polymesh-wallet/issues/232)) ([9890e1e](https://github.com/PolymathNetwork/polymesh-wallet/commit/9890e1e6317d88bc2cbb45b48d35eebd52ea0d42))

# [1.4.0](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.3.2...1.4.0) (2021-11-12)


### Features

* UI & UX improvements ([#231](https://github.com/PolymathNetwork/polymesh-wallet/issues/231)) ([b878ddc](https://github.com/PolymathNetwork/polymesh-wallet/commit/b878ddcfb515e22e3b85bef5f78ae237787de189))

## [1.3.2](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.3.1...1.3.2) (2021-11-11)


### Bug Fixes

* set yarn policies to 1.19.0 ([c978d03](https://github.com/PolymathNetwork/polymesh-wallet/commit/c978d031264379b2353f271767a7a8b89be1a14e))

## [1.3.1](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.3.0...1.3.1) (2021-11-11)


### Bug Fixes

* update dependencies to correct version ([5de6100](https://github.com/PolymathNetwork/polymesh-wallet/commit/5de6100b776452630c32bc76cb1fa6d1b5b6e486))

# [1.3.0](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.2.2...1.3.0) (2021-11-11)


### Features

* UI/UX updates ([#229](https://github.com/PolymathNetwork/polymesh-wallet/issues/229)) ([dee3225](https://github.com/PolymathNetwork/polymesh-wallet/commit/dee32256bb78e866bc55cdab1171e58f46156d33))

## [1.2.2](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.2.1...1.2.2) (2021-11-05)


### Bug Fixes

* disable uid whitelist checks ([#227](https://github.com/PolymathNetwork/polymesh-wallet/issues/227)) ([a437f4c](https://github.com/PolymathNetwork/polymesh-wallet/commit/a437f4c26da1de6194e7f076736dd3a195957ee4))

## [1.2.1](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.2.0...1.2.1) (2021-11-04)


### Bug Fixes

* remove trailing slash in url ([#226](https://github.com/PolymathNetwork/polymesh-wallet/issues/226)) ([b2fd040](https://github.com/PolymathNetwork/polymesh-wallet/commit/b2fd040af491fcc2f2ea7ca9801003e9c69ce12f))

# [1.2.0](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.1.1...1.2.0) (2021-11-01)


### Features

* clickable addresses (copy icon by default & adding tooltip) ([#219](https://github.com/PolymathNetwork/polymesh-wallet/issues/219)) ([2d9f6ba](https://github.com/PolymathNetwork/polymesh-wallet/commit/2d9f6ba737fd2a0b25ef78e813745adcc6b17bc4))

# [1.1.0-develop.1](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.0.0...1.1.0-develop.1) (2021-10-28)


### Bug Fixes

* **CI:** update bump-versions script ([66191e2](https://github.com/PolymathNetwork/polymesh-wallet/commit/66191e2a72901dd633af741497682b9d63c881dc))
* downgrade packages to work with ITN Rewards [GTN-2084] ([#211](https://github.com/PolymathNetwork/polymesh-wallet/issues/211)) ([d2d87a7](https://github.com/PolymathNetwork/polymesh-wallet/commit/d2d87a747096392909c6f059748597039a0b49cd))
* lint ([c9d3d02](https://github.com/PolymathNetwork/polymesh-wallet/commit/c9d3d0248ec1d127b316116c86a728133afa246d))
* mainnet rpc url ([#222](https://github.com/PolymathNetwork/polymesh-wallet/issues/222)) ([c619e86](https://github.com/PolymathNetwork/polymesh-wallet/commit/c619e86e55dee3185a1786483fbf05c4703212f6))
* network change bug ([#204](https://github.com/PolymathNetwork/polymesh-wallet/issues/204)) ([26a6d4d](https://github.com/PolymathNetwork/polymesh-wallet/commit/26a6d4d36fc496e45b11653f0c2cb00b53441f48))
* pass build ([54a3a2f](https://github.com/PolymathNetwork/polymesh-wallet/commit/54a3a2fe4cda7764bc2b0dc1827915deb2201f62))
* refactor api connection ([#203](https://github.com/PolymathNetwork/polymesh-wallet/issues/203)) ([82746d7](https://github.com/PolymathNetwork/polymesh-wallet/commit/82746d7b26fec5ff00507e7d505852bd4856aecc))
* revert "--no-ci" from semantic release ([429e97f](https://github.com/PolymathNetwork/polymesh-wallet/commit/429e97fc216782d33afa9c94c5a5a20a7a6c2349))
* temporarily disable network mismatch detection ([#210](https://github.com/PolymathNetwork/polymesh-wallet/issues/210)) ([09563c9](https://github.com/PolymathNetwork/polymesh-wallet/commit/09563c9730e4e43fd2d97275edfefda9a04eeba8))
* toast colors ([#215](https://github.com/PolymathNetwork/polymesh-wallet/issues/215)) ([c9cd8dd](https://github.com/PolymathNetwork/polymesh-wallet/commit/c9cd8ddf89d00dc90b0e6259a91b3d20101b0c4d))
* update fallback schemas ([5f01948](https://github.com/PolymathNetwork/polymesh-wallet/commit/5f01948aab7ba8a76560b748b911c10520aae659))
* use autoMergeLevel2 to reconcile state ([#218](https://github.com/PolymathNetwork/polymesh-wallet/issues/218)) ([a856a51](https://github.com/PolymathNetwork/polymesh-wallet/commit/a856a5123fcec9f6370fe9dd46fc13ea9bf067cc))


### Features

* **CI:** use semantic release ([#212](https://github.com/PolymathNetwork/polymesh-wallet/issues/212)) ([f96610e](https://github.com/PolymathNetwork/polymesh-wallet/commit/f96610eb87fbcff3e90b0c5f1f894a1e3e4a1669)), closes [#58](https://github.com/PolymathNetwork/polymesh-wallet/issues/58) [#211](https://github.com/PolymathNetwork/polymesh-wallet/issues/211) [#204](https://github.com/PolymathNetwork/polymesh-wallet/issues/204) [#203](https://github.com/PolymathNetwork/polymesh-wallet/issues/203) [#210](https://github.com/PolymathNetwork/polymesh-wallet/issues/210) [#205](https://github.com/PolymathNetwork/polymesh-wallet/issues/205) [#198](https://github.com/PolymathNetwork/polymesh-wallet/issues/198) [#206](https://github.com/PolymathNetwork/polymesh-wallet/issues/206)
* re-enable Connect Ledger button ([#220](https://github.com/PolymathNetwork/polymesh-wallet/issues/220)) ([93b077a](https://github.com/PolymathNetwork/polymesh-wallet/commit/93b077a7c4de0ca5cebee1318414b1c6e8697484))
* **UI:** add Testnet network selector ([#217](https://github.com/PolymathNetwork/polymesh-wallet/issues/217)) ([973f4b8](https://github.com/PolymathNetwork/polymesh-wallet/commit/973f4b8f1384a5cfa40f9adbb3e5edb8ca3b3905))
* **UI:** network selector update [GTN-346] ([#205](https://github.com/PolymathNetwork/polymesh-wallet/issues/205)) ([d62f173](https://github.com/PolymathNetwork/polymesh-wallet/commit/d62f17313e6c51d11f817561d0a486b7dc71e2c3))
* **UI:** new Polymesh theme [WAL-168] ([#198](https://github.com/PolymathNetwork/polymesh-wallet/issues/198)) ([a51e011](https://github.com/PolymathNetwork/polymesh-wallet/commit/a51e0114bc506e81722ecc4e498c57703f0e58ad))
* **UI:** update Development network names ([#213](https://github.com/PolymathNetwork/polymesh-wallet/issues/213)) ([c4d4ec6](https://github.com/PolymathNetwork/polymesh-wallet/commit/c4d4ec697de1d0ae317fc5b454dda657eccebf3d))
* **UI:** update main menu UI [GTN-344] ([#206](https://github.com/PolymathNetwork/polymesh-wallet/issues/206)) ([8a47d3c](https://github.com/PolymathNetwork/polymesh-wallet/commit/8a47d3c0eb88be7475bf73d00694d92357ae4b67))
* **UI:** update toast notification styles [GTN-349] ([#214](https://github.com/PolymathNetwork/polymesh-wallet/issues/214)) ([ba548cb](https://github.com/PolymathNetwork/polymesh-wallet/commit/ba548cb2736f6ec125e4902369d420c2af16a0b7))

# 1.0.0 (2021-10-28)


### Bug Fixes

* account selected when assign is clicked ([c953ee7](https://github.com/PolymathNetwork/polymesh-wallet/commit/c953ee7bd368e666cbe1256bb6f4eee8ee564a44))
* Account table is showing on top of the top panel (WAL-53) ([0ec70a8](https://github.com/PolymathNetwork/polymesh-wallet/commit/0ec70a8b5eadcd5b17b4bc09419bd2dd4adcc8db))
* add background color to account card to make it not-transparent ([c3aea9c](https://github.com/PolymathNetwork/polymesh-wallet/commit/c3aea9c15e6142a7b87cbdcecede963efefe222d))
* add grid area definition for unassigned accounts on hover ([e9fb061](https://github.com/PolymathNetwork/polymesh-wallet/commit/e9fb061cc02291321e7b34ccb6a80b82b1819625))
* add icon for verified and fix alignment ([9b12399](https://github.com/PolymathNetwork/polymesh-wallet/commit/9b123997ae688718777ef6407e5da7f7dfb17d1c))
* add specified width for `name`'s wrapping element ([a323637](https://github.com/PolymathNetwork/polymesh-wallet/commit/a3236375137eedc91470c3b3ac5041b9b6a0a12b))
* alias editing textfield unnecessarily tall (MER-46) ([f8b5541](https://github.com/PolymathNetwork/polymesh-wallet/commit/f8b5541e9bc57ff81f3ae6d57a5bc04f22a185a0))
* all copy icons that appear on hover never disappear, on blur (MER-46) ([4f9f7b1](https://github.com/PolymathNetwork/polymesh-wallet/commit/4f9f7b1e0b2e58bcaaa7eb2fa01fd4dbe2453e52))
* allow scrolling only to see expandable details ([8387cde](https://github.com/PolymathNetwork/polymesh-wallet/commit/8387cde57d030a3b7d69f9f1f4754a8685915e84))
* build error ([f7d3b21](https://github.com/PolymathNetwork/polymesh-wallet/commit/f7d3b211215231a989f6b8b9ad6be8b473e6bdac))
* build error ([c2eb3af](https://github.com/PolymathNetwork/polymesh-wallet/commit/c2eb3af4759f67506571b8a4acc1e04c953ddb28))
* build error ([8b7e916](https://github.com/PolymathNetwork/polymesh-wallet/commit/8b7e916aed33a3485c25f3873326f096f9b79572))
* build error ([2c11624](https://github.com/PolymathNetwork/polymesh-wallet/commit/2c11624df232ed650b0054f6f614128c5e4ec753))
* build error ([3e16f5a](https://github.com/PolymathNetwork/polymesh-wallet/commit/3e16f5a416b1436798060ebfbe29404c514b1394))
* build error ([44f5c8c](https://github.com/PolymathNetwork/polymesh-wallet/commit/44f5c8c4cc49074c77233681bfe63233cb5a33f1))
* bump to v0.5.7 ([#201](https://github.com/PolymathNetwork/polymesh-wallet/issues/201)) ([c0c955d](https://github.com/PolymathNetwork/polymesh-wallet/commit/c0c955da9e0faa251b7d76f142322f917fd7703b))
* capitalization ([3ad776c](https://github.com/PolymathNetwork/polymesh-wallet/commit/3ad776c775777529080a5989e908a04d4bcfd573))
* capitalization (WAL-86) ([#58](https://github.com/PolymathNetwork/polymesh-wallet/issues/58)) ([661a98c](https://github.com/PolymathNetwork/polymesh-wallet/commit/661a98cb5757af712ca81064038365a18a2adf47))
* center image ([7063106](https://github.com/PolymathNetwork/polymesh-wallet/commit/70631065c3cafb654139da5510b7266bd77beb22))
* change new account labels on 'add key' to be consistent (WAL-57) ([12a1720](https://github.com/PolymathNetwork/polymesh-wallet/commit/12a1720f172c0b7275f09aa9f6e10fcc3287b255))
* change password of imported. account ([ec1a8ff](https://github.com/PolymathNetwork/polymesh-wallet/commit/ec1a8ff96f0078d06f232b07453fa3fb739a40a9))
* clicking on copy triggers account selection ([1f5e40b](https://github.com/PolymathNetwork/polymesh-wallet/commit/1f5e40bbe4d96cf0364b85d1860519a66be7e921))
* compare network ([7651a97](https://github.com/PolymathNetwork/polymesh-wallet/commit/7651a97394af06912e99444fd5401589a342dd2e))
* copy indicator (WAL-54) ([db10c88](https://github.com/PolymathNetwork/polymesh-wallet/commit/db10c880f6c5a5fa6670c732e9ef9c3ee9acef0e))
* copy tooltip position ([9451de8](https://github.com/PolymathNetwork/polymesh-wallet/commit/9451de81e506788e7c969b9bc02629845c04348c))
* did alias input height ([9ce487b](https://github.com/PolymathNetwork/polymesh-wallet/commit/9ce487b679a0624cedc928feec771daad7d2342a))
* ellipsize text overflow for name display in account details ([f28a82f](https://github.com/PolymathNetwork/polymesh-wallet/commit/f28a82ff95ac2862a265402e43b79177204ccbf8))
* event propagation of edit account links ([0dd07c6](https://github.com/PolymathNetwork/polymesh-wallet/commit/0dd07c692aacf78672566435c7267d3619227eee))
* generate proof ui ([85a2875](https://github.com/PolymathNetwork/polymesh-wallet/commit/85a2875e77ff41aa8ef19b6fbec437a12c13f612))
* lint error ([60923f0](https://github.com/PolymathNetwork/polymesh-wallet/commit/60923f0f2c0398852d49cf6aec2f1994b2e3e762))
* lint errors ([443e708](https://github.com/PolymathNetwork/polymesh-wallet/commit/443e70890fdcee4c0aaa352a68205c4be1baeff4))
* lint errors ([c33ce13](https://github.com/PolymathNetwork/polymesh-wallet/commit/c33ce13bb149f1063d6386f5f9674c8831e60e6b))
* lint issue (alphabetical props) ([c1d665c](https://github.com/PolymathNetwork/polymesh-wallet/commit/c1d665c304cc815fa5d7fd9328a938bc068723dd))
* lint issues ([f15a914](https://github.com/PolymathNetwork/polymesh-wallet/commit/f15a914b59868500d735d2f2fa7d21f02c45749e))
* make equal size reject/sign buttons ([e79b0c4](https://github.com/PolymathNetwork/polymesh-wallet/commit/e79b0c49bc646d5b99d2cfacd06eee5b9613c505))
* menu for unassigned account ([44a495e](https://github.com/PolymathNetwork/polymesh-wallet/commit/44a495e7c1a50c5df48f2578ef419e39cc430b02))
* menu not rendering for header menu items ([1967f41](https://github.com/PolymathNetwork/polymesh-wallet/commit/1967f412223dfbbaec40a0ac0571f376f3f3942a))
* Remove intro screen for new user (WAL-58) ([27454a7](https://github.com/PolymathNetwork/polymesh-wallet/commit/27454a78164872a48dc269aa20e4c23abea98214))
* remove memoization to make type/index selections work properly ([a72a7f3](https://github.com/PolymathNetwork/polymesh-wallet/commit/a72a7f3e50b20622059b9259232b4a6fc8a20c72))
* remove trailing bredcrumb line ([e03e7e2](https://github.com/PolymathNetwork/polymesh-wallet/commit/e03e7e2872ed0203ed38097654c109c289768f74))
* remove unused dependencies ([03e1a5a](https://github.com/PolymathNetwork/polymesh-wallet/commit/03e1a5af5f42e0de07c0646e17e235b771eb745f))
* revert back to orignal renders ([96e2ea2](https://github.com/PolymathNetwork/polymesh-wallet/commit/96e2ea2174ee335f6683a872554ca82e2427456c))
* update copy “Authorize” to “Sign” ([bc7cffb](https://github.com/PolymathNetwork/polymesh-wallet/commit/bc7cffba4e0e1868a37d64f3001af524843a1d4c))
* update margins, colors, opacity ([538abb4](https://github.com/PolymathNetwork/polymesh-wallet/commit/538abb482ef20a3abe7eea8b0cd2cb60f6a79386))
* update test, change copy ([e9843cd](https://github.com/PolymathNetwork/polymesh-wallet/commit/e9843cd790260909775ecac0d5fb4cceb471da8b))
* use `minWidth` for `name`'s wrapping element instead ([b8ac2c4](https://github.com/PolymathNetwork/polymesh-wallet/commit/b8ac2c458dc7f5285dc7b0ba2958f6044e213780))
* use `TextOverflowEllipsis` for displaying name in `AccountHeader` ([77dc283](https://github.com/PolymathNetwork/polymesh-wallet/commit/77dc2830bd64049f5e41c7f9cd6c0ef818cdb2be))


### Features

* account details view (WAL-43) ([690090e](https://github.com/PolymathNetwork/polymesh-wallet/commit/690090eb489d4a1fb6636d16e404c131a0f61cfd))
* account uid view ([b85484c](https://github.com/PolymathNetwork/polymesh-wallet/commit/b85484c9e6e8d8032230300c4821a5360eff8b22))
* add "attention" info when adding new account ([2263608](https://github.com/PolymathNetwork/polymesh-wallet/commit/2263608e579d8694adfed78fa71df5b4775972df))
* add busy prop to button ([b166b02](https://github.com/PolymathNetwork/polymesh-wallet/commit/b166b021b5beb5501c2a7d4bed9aee2111541767))
* add header ([4afc138](https://github.com/PolymathNetwork/polymesh-wallet/commit/4afc13875608a3147722f57331bbfbf99ae128e9))
* add images ([6a821e0](https://github.com/PolymathNetwork/polymesh-wallet/commit/6a821e0f0e60dc1f28dcc58ba90e4819ca1212e6))
* add ledger icon to refresh button, refactor UI ([f1ea04f](https://github.com/PolymathNetwork/polymesh-wallet/commit/f1ea04f6ce86a065a02f885c18e23e49ca29e57d))
* add open lock icon ([8eda0d9](https://github.com/PolymathNetwork/polymesh-wallet/commit/8eda0d9394d82ea3792bd20caf4c81bbec2d3352))
* add styled step-list ([463ed73](https://github.com/PolymathNetwork/polymesh-wallet/commit/463ed739428bf922a0b25b979fa6a203d7686157))
* add TextOverflowEllipsis component ([5d8c2ee](https://github.com/PolymathNetwork/polymesh-wallet/commit/5d8c2eeff4de2b985157a8c4f603f9a4510532b2))
* add tooltip component ([88f3ce1](https://github.com/PolymathNetwork/polymesh-wallet/commit/88f3ce1106f3bbda8d0f20f7d1f791f062f9994b))
* assign button link to dashboard (WAL-44) ([20b916c](https://github.com/PolymathNetwork/polymesh-wallet/commit/20b916cc0ef27c80d5c0e4fe4f2e4f3839072d08))
* cancel button ([9814d5d](https://github.com/PolymathNetwork/polymesh-wallet/commit/9814d5d06a36b50b850933f67762e039737629c6))
* change default placeholder text for password when adding a new account ([3e7807e](https://github.com/PolymathNetwork/polymesh-wallet/commit/3e7807e5841dcf821369b71eb3bf4c8169728040))
* change password ([dd66059](https://github.com/PolymathNetwork/polymesh-wallet/commit/dd66059dd2337513019a6d75a3a53e462eefd5fa))
* context menu (WAL-45) ([a186cde](https://github.com/PolymathNetwork/polymesh-wallet/commit/a186cde858845b2e9bc979f77d84eff8b82c7114))
* dashboard link ([3b464b3](https://github.com/PolymathNetwork/polymesh-wallet/commit/3b464b33d8b4d05e1a082b8af28dd34cf5a02da5))
* export account ([2250ef2](https://github.com/PolymathNetwork/polymesh-wallet/commit/2250ef278644cb2d1e0242e3eed75b562d620618))
* Field validation when user entering new password (WAL-61) ([d9b33f0](https://github.com/PolymathNetwork/polymesh-wallet/commit/d9b33f08ad95c77c7310ae9058395e78006f18ce))
* Field validation when user entering new password (WAL-61). ([3676d26](https://github.com/PolymathNetwork/polymesh-wallet/commit/3676d26427d05e45fed0499c24bc5b010da48677))
* global isBusy listener ([99ab810](https://github.com/PolymathNetwork/polymesh-wallet/commit/99ab81073d1c09e0a0c7951be01c614821689a43))
* highlight texts based on troubleshoot step ([d101622](https://github.com/PolymathNetwork/polymesh-wallet/commit/d101622463e1cde2833740b5a6e7f72f3f3d8af8))
* Hr component ([5b091ee](https://github.com/PolymathNetwork/polymesh-wallet/commit/5b091ee4bdae981ec0c3e484a5e5ed11ee315b96))
* import account json ([c66fdeb](https://github.com/PolymathNetwork/polymesh-wallet/commit/c66fdeb1df80644f7198680a2438127032db74d3))
* import json ([bfb425a](https://github.com/PolymathNetwork/polymesh-wallet/commit/bfb425a19cb2e94339ddeaf21389674b57234b94))
* import json loading indicator(WAL-36) ([0881f37](https://github.com/PolymathNetwork/polymesh-wallet/commit/0881f37d2deb0b7e38b05cb82110eaec0597b7ac))
* import json wip ([817b3bb](https://github.com/PolymathNetwork/polymesh-wallet/commit/817b3bbfc0a191e749dd592325dee60d93ebf7c5))
* import seed loading indicator (WAL-36) ([b164846](https://github.com/PolymathNetwork/polymesh-wallet/commit/b164846014e02dbca3b0a5fe0983ad7d66b4f4fb))
* in-place identity alias editor (WAL-34) ([c1bef4c](https://github.com/PolymathNetwork/polymesh-wallet/commit/c1bef4c21c74e735121fdb12c24456a8af1448b7))
* loading indicator (WAL-36) ([20abb95](https://github.com/PolymathNetwork/polymesh-wallet/commit/20abb95134d46966ce131f811c72d7f50fa2ed7a))
* password component ([28811c6](https://github.com/PolymathNetwork/polymesh-wallet/commit/28811c6f1d6f4e00f648999c6465c3fbeb4e6b16))
* restructure account import screens ([d93966a](https://github.com/PolymathNetwork/polymesh-wallet/commit/d93966ad756172376f3e1e26861111de97e8f175))
* reuse password container in new account form ([b8275a3](https://github.com/PolymathNetwork/polymesh-wallet/commit/b8275a359a7ddd162dc0c2c7cb53d9ef454aac88))
* show name and initials ([2c46b38](https://github.com/PolymathNetwork/polymesh-wallet/commit/2c46b38a47759186c0adb67588724bd3bbc83147))
* toggle advanced settings dropdown ([0396fb8](https://github.com/PolymathNetwork/polymesh-wallet/commit/0396fb8a40699adf1776f77a786cffe1405bd496))
* unlock uid ([b2cfe25](https://github.com/PolymathNetwork/polymesh-wallet/commit/b2cfe256bf606f2284d89c2597a50f3a23881370))
* update open-application troubleshoot guide styling ([e8581be](https://github.com/PolymathNetwork/polymesh-wallet/commit/e8581be9446870aa04ceddae002ec54018e24089))
* use css grids to align items for AccountView ([e33c34f](https://github.com/PolymathNetwork/polymesh-wallet/commit/e33c34f7b0f6b470a7521102fdf8c260493bdc9a))
* use password component to import seed ([8139e69](https://github.com/PolymathNetwork/polymesh-wallet/commit/8139e69f25e798d5430d7c6cb44e72b21524a683))
* validate and save account ([22edc39](https://github.com/PolymathNetwork/polymesh-wallet/commit/22edc39d4a57109a79d8be549216dd04e308d361))
* wip - name component ([c4b4f7e](https://github.com/PolymathNetwork/polymesh-wallet/commit/c4b4f7eecaca24896232e4a0047ea83fbaf28854))

# [1.0.0-develop.8](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.0.0-develop.7...1.0.0-develop.8) (2021-10-28)


### Bug Fixes

* mainnet rpc url ([#222](https://github.com/PolymathNetwork/polymesh-wallet/issues/222)) ([c619e86](https://github.com/PolymathNetwork/polymesh-wallet/commit/c619e86e55dee3185a1786483fbf05c4703212f6))

# [1.0.0-develop.7](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.0.0-develop.6...1.0.0-develop.7) (2021-10-27)


### Features

* re-enable Connect Ledger button ([#220](https://github.com/PolymathNetwork/polymesh-wallet/issues/220)) ([93b077a](https://github.com/PolymathNetwork/polymesh-wallet/commit/93b077a7c4de0ca5cebee1318414b1c6e8697484))

# [1.0.0-develop.6](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.0.0-develop.5...1.0.0-develop.6) (2021-10-18)


### Bug Fixes

* use autoMergeLevel2 to reconcile state ([#218](https://github.com/PolymathNetwork/polymesh-wallet/issues/218)) ([a856a51](https://github.com/PolymathNetwork/polymesh-wallet/commit/a856a5123fcec9f6370fe9dd46fc13ea9bf067cc))

# [1.0.0-develop.5](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.0.0-develop.4...1.0.0-develop.5) (2021-10-18)


### Features

* **UI:** add Testnet network selector ([#217](https://github.com/PolymathNetwork/polymesh-wallet/issues/217)) ([973f4b8](https://github.com/PolymathNetwork/polymesh-wallet/commit/973f4b8f1384a5cfa40f9adbb3e5edb8ca3b3905))

# [1.0.0-develop.4](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.0.0-develop.3...1.0.0-develop.4) (2021-10-13)


### Bug Fixes

* revert "--no-ci" from semantic release ([429e97f](https://github.com/PolymathNetwork/polymesh-wallet/commit/429e97fc216782d33afa9c94c5a5a20a7a6c2349))
* toast colors ([#215](https://github.com/PolymathNetwork/polymesh-wallet/issues/215)) ([c9cd8dd](https://github.com/PolymathNetwork/polymesh-wallet/commit/c9cd8ddf89d00dc90b0e6259a91b3d20101b0c4d))

# [1.0.0-develop.3](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.0.0-develop.2...1.0.0-develop.3) (2021-10-08)


### Bug Fixes

* **CI:** update bump-versions script ([66191e2](https://github.com/PolymathNetwork/polymesh-wallet/commit/66191e2a72901dd633af741497682b9d63c881dc))


### Features

* **UI:** update toast notification styles [GTN-349] ([#214](https://github.com/PolymathNetwork/polymesh-wallet/issues/214)) ([ba548cb](https://github.com/PolymathNetwork/polymesh-wallet/commit/ba548cb2736f6ec125e4902369d420c2af16a0b7))

# [1.0.0-develop.2](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.0.0-develop.1...1.0.0-develop.2) (2021-10-05)


### Features

* **UI:** update Development network names ([#213](https://github.com/PolymathNetwork/polymesh-wallet/issues/213)) ([c4d4ec6](https://github.com/PolymathNetwork/polymesh-wallet/commit/c4d4ec697de1d0ae317fc5b454dda657eccebf3d))

# 1.0.0-develop.1 (2021-10-05)


### Bug Fixes

* account selected when assign is clicked ([c953ee7](https://github.com/PolymathNetwork/polymesh-wallet/commit/c953ee7bd368e666cbe1256bb6f4eee8ee564a44))
* Account table is showing on top of the top panel (WAL-53) ([0ec70a8](https://github.com/PolymathNetwork/polymesh-wallet/commit/0ec70a8b5eadcd5b17b4bc09419bd2dd4adcc8db))
* add background color to account card to make it not-transparent ([c3aea9c](https://github.com/PolymathNetwork/polymesh-wallet/commit/c3aea9c15e6142a7b87cbdcecede963efefe222d))
* add grid area definition for unassigned accounts on hover ([e9fb061](https://github.com/PolymathNetwork/polymesh-wallet/commit/e9fb061cc02291321e7b34ccb6a80b82b1819625))
* add icon for verified and fix alignment ([9b12399](https://github.com/PolymathNetwork/polymesh-wallet/commit/9b123997ae688718777ef6407e5da7f7dfb17d1c))
* add specified width for `name`'s wrapping element ([a323637](https://github.com/PolymathNetwork/polymesh-wallet/commit/a3236375137eedc91470c3b3ac5041b9b6a0a12b))
* alias editing textfield unnecessarily tall (MER-46) ([f8b5541](https://github.com/PolymathNetwork/polymesh-wallet/commit/f8b5541e9bc57ff81f3ae6d57a5bc04f22a185a0))
* all copy icons that appear on hover never disappear, on blur (MER-46) ([4f9f7b1](https://github.com/PolymathNetwork/polymesh-wallet/commit/4f9f7b1e0b2e58bcaaa7eb2fa01fd4dbe2453e52))
* allow scrolling only to see expandable details ([8387cde](https://github.com/PolymathNetwork/polymesh-wallet/commit/8387cde57d030a3b7d69f9f1f4754a8685915e84))
* build error ([f7d3b21](https://github.com/PolymathNetwork/polymesh-wallet/commit/f7d3b211215231a989f6b8b9ad6be8b473e6bdac))
* build error ([c2eb3af](https://github.com/PolymathNetwork/polymesh-wallet/commit/c2eb3af4759f67506571b8a4acc1e04c953ddb28))
* build error ([8b7e916](https://github.com/PolymathNetwork/polymesh-wallet/commit/8b7e916aed33a3485c25f3873326f096f9b79572))
* build error ([2c11624](https://github.com/PolymathNetwork/polymesh-wallet/commit/2c11624df232ed650b0054f6f614128c5e4ec753))
* build error ([3e16f5a](https://github.com/PolymathNetwork/polymesh-wallet/commit/3e16f5a416b1436798060ebfbe29404c514b1394))
* build error ([44f5c8c](https://github.com/PolymathNetwork/polymesh-wallet/commit/44f5c8c4cc49074c77233681bfe63233cb5a33f1))
* capitalization ([3ad776c](https://github.com/PolymathNetwork/polymesh-wallet/commit/3ad776c775777529080a5989e908a04d4bcfd573))
* capitalization (WAL-86) ([#58](https://github.com/PolymathNetwork/polymesh-wallet/issues/58)) ([661a98c](https://github.com/PolymathNetwork/polymesh-wallet/commit/661a98cb5757af712ca81064038365a18a2adf47))
* center image ([7063106](https://github.com/PolymathNetwork/polymesh-wallet/commit/70631065c3cafb654139da5510b7266bd77beb22))
* change new account labels on 'add key' to be consistent (WAL-57) ([12a1720](https://github.com/PolymathNetwork/polymesh-wallet/commit/12a1720f172c0b7275f09aa9f6e10fcc3287b255))
* change password of imported. account ([ec1a8ff](https://github.com/PolymathNetwork/polymesh-wallet/commit/ec1a8ff96f0078d06f232b07453fa3fb739a40a9))
* clicking on copy triggers account selection ([1f5e40b](https://github.com/PolymathNetwork/polymesh-wallet/commit/1f5e40bbe4d96cf0364b85d1860519a66be7e921))
* compare network ([7651a97](https://github.com/PolymathNetwork/polymesh-wallet/commit/7651a97394af06912e99444fd5401589a342dd2e))
* copy indicator (WAL-54) ([db10c88](https://github.com/PolymathNetwork/polymesh-wallet/commit/db10c880f6c5a5fa6670c732e9ef9c3ee9acef0e))
* copy tooltip position ([9451de8](https://github.com/PolymathNetwork/polymesh-wallet/commit/9451de81e506788e7c969b9bc02629845c04348c))
* did alias input height ([9ce487b](https://github.com/PolymathNetwork/polymesh-wallet/commit/9ce487b679a0624cedc928feec771daad7d2342a))
* downgrade packages to work with ITN Rewards [GTN-2084] ([#211](https://github.com/PolymathNetwork/polymesh-wallet/issues/211)) ([d2d87a7](https://github.com/PolymathNetwork/polymesh-wallet/commit/d2d87a747096392909c6f059748597039a0b49cd))
* ellipsize text overflow for name display in account details ([f28a82f](https://github.com/PolymathNetwork/polymesh-wallet/commit/f28a82ff95ac2862a265402e43b79177204ccbf8))
* event propagation of edit account links ([0dd07c6](https://github.com/PolymathNetwork/polymesh-wallet/commit/0dd07c692aacf78672566435c7267d3619227eee))
* generate proof ui ([85a2875](https://github.com/PolymathNetwork/polymesh-wallet/commit/85a2875e77ff41aa8ef19b6fbec437a12c13f612))
* lint ([c9d3d02](https://github.com/PolymathNetwork/polymesh-wallet/commit/c9d3d0248ec1d127b316116c86a728133afa246d))
* lint error ([60923f0](https://github.com/PolymathNetwork/polymesh-wallet/commit/60923f0f2c0398852d49cf6aec2f1994b2e3e762))
* lint errors ([443e708](https://github.com/PolymathNetwork/polymesh-wallet/commit/443e70890fdcee4c0aaa352a68205c4be1baeff4))
* lint errors ([c33ce13](https://github.com/PolymathNetwork/polymesh-wallet/commit/c33ce13bb149f1063d6386f5f9674c8831e60e6b))
* lint issue (alphabetical props) ([c1d665c](https://github.com/PolymathNetwork/polymesh-wallet/commit/c1d665c304cc815fa5d7fd9328a938bc068723dd))
* lint issues ([f15a914](https://github.com/PolymathNetwork/polymesh-wallet/commit/f15a914b59868500d735d2f2fa7d21f02c45749e))
* make equal size reject/sign buttons ([e79b0c4](https://github.com/PolymathNetwork/polymesh-wallet/commit/e79b0c49bc646d5b99d2cfacd06eee5b9613c505))
* menu for unassigned account ([44a495e](https://github.com/PolymathNetwork/polymesh-wallet/commit/44a495e7c1a50c5df48f2578ef419e39cc430b02))
* menu not rendering for header menu items ([1967f41](https://github.com/PolymathNetwork/polymesh-wallet/commit/1967f412223dfbbaec40a0ac0571f376f3f3942a))
* network change bug ([#204](https://github.com/PolymathNetwork/polymesh-wallet/issues/204)) ([26a6d4d](https://github.com/PolymathNetwork/polymesh-wallet/commit/26a6d4d36fc496e45b11653f0c2cb00b53441f48))
* pass build ([54a3a2f](https://github.com/PolymathNetwork/polymesh-wallet/commit/54a3a2fe4cda7764bc2b0dc1827915deb2201f62))
* refactor api connection ([#203](https://github.com/PolymathNetwork/polymesh-wallet/issues/203)) ([82746d7](https://github.com/PolymathNetwork/polymesh-wallet/commit/82746d7b26fec5ff00507e7d505852bd4856aecc))
* Remove intro screen for new user (WAL-58) ([27454a7](https://github.com/PolymathNetwork/polymesh-wallet/commit/27454a78164872a48dc269aa20e4c23abea98214))
* remove memoization to make type/index selections work properly ([a72a7f3](https://github.com/PolymathNetwork/polymesh-wallet/commit/a72a7f3e50b20622059b9259232b4a6fc8a20c72))
* remove trailing bredcrumb line ([e03e7e2](https://github.com/PolymathNetwork/polymesh-wallet/commit/e03e7e2872ed0203ed38097654c109c289768f74))
* remove unused dependencies ([03e1a5a](https://github.com/PolymathNetwork/polymesh-wallet/commit/03e1a5af5f42e0de07c0646e17e235b771eb745f))
* revert back to orignal renders ([96e2ea2](https://github.com/PolymathNetwork/polymesh-wallet/commit/96e2ea2174ee335f6683a872554ca82e2427456c))
* temporarily disable network mismatch detection ([#210](https://github.com/PolymathNetwork/polymesh-wallet/issues/210)) ([09563c9](https://github.com/PolymathNetwork/polymesh-wallet/commit/09563c9730e4e43fd2d97275edfefda9a04eeba8))
* update copy “Authorize” to “Sign” ([bc7cffb](https://github.com/PolymathNetwork/polymesh-wallet/commit/bc7cffba4e0e1868a37d64f3001af524843a1d4c))
* update fallback schemas ([5f01948](https://github.com/PolymathNetwork/polymesh-wallet/commit/5f01948aab7ba8a76560b748b911c10520aae659))
* update margins, colors, opacity ([538abb4](https://github.com/PolymathNetwork/polymesh-wallet/commit/538abb482ef20a3abe7eea8b0cd2cb60f6a79386))
* update test, change copy ([e9843cd](https://github.com/PolymathNetwork/polymesh-wallet/commit/e9843cd790260909775ecac0d5fb4cceb471da8b))
* use `minWidth` for `name`'s wrapping element instead ([b8ac2c4](https://github.com/PolymathNetwork/polymesh-wallet/commit/b8ac2c458dc7f5285dc7b0ba2958f6044e213780))
* use `TextOverflowEllipsis` for displaying name in `AccountHeader` ([77dc283](https://github.com/PolymathNetwork/polymesh-wallet/commit/77dc2830bd64049f5e41c7f9cd6c0ef818cdb2be))


### Features

* account details view (WAL-43) ([690090e](https://github.com/PolymathNetwork/polymesh-wallet/commit/690090eb489d4a1fb6636d16e404c131a0f61cfd))
* account uid view ([b85484c](https://github.com/PolymathNetwork/polymesh-wallet/commit/b85484c9e6e8d8032230300c4821a5360eff8b22))
* add "attention" info when adding new account ([2263608](https://github.com/PolymathNetwork/polymesh-wallet/commit/2263608e579d8694adfed78fa71df5b4775972df))
* add busy prop to button ([b166b02](https://github.com/PolymathNetwork/polymesh-wallet/commit/b166b021b5beb5501c2a7d4bed9aee2111541767))
* add header ([4afc138](https://github.com/PolymathNetwork/polymesh-wallet/commit/4afc13875608a3147722f57331bbfbf99ae128e9))
* add images ([6a821e0](https://github.com/PolymathNetwork/polymesh-wallet/commit/6a821e0f0e60dc1f28dcc58ba90e4819ca1212e6))
* add ledger icon to refresh button, refactor UI ([f1ea04f](https://github.com/PolymathNetwork/polymesh-wallet/commit/f1ea04f6ce86a065a02f885c18e23e49ca29e57d))
* add open lock icon ([8eda0d9](https://github.com/PolymathNetwork/polymesh-wallet/commit/8eda0d9394d82ea3792bd20caf4c81bbec2d3352))
* add styled step-list ([463ed73](https://github.com/PolymathNetwork/polymesh-wallet/commit/463ed739428bf922a0b25b979fa6a203d7686157))
* add TextOverflowEllipsis component ([5d8c2ee](https://github.com/PolymathNetwork/polymesh-wallet/commit/5d8c2eeff4de2b985157a8c4f603f9a4510532b2))
* add tooltip component ([88f3ce1](https://github.com/PolymathNetwork/polymesh-wallet/commit/88f3ce1106f3bbda8d0f20f7d1f791f062f9994b))
* assign button link to dashboard (WAL-44) ([20b916c](https://github.com/PolymathNetwork/polymesh-wallet/commit/20b916cc0ef27c80d5c0e4fe4f2e4f3839072d08))
* cancel button ([9814d5d](https://github.com/PolymathNetwork/polymesh-wallet/commit/9814d5d06a36b50b850933f67762e039737629c6))
* change default placeholder text for password when adding a new account ([3e7807e](https://github.com/PolymathNetwork/polymesh-wallet/commit/3e7807e5841dcf821369b71eb3bf4c8169728040))
* change password ([dd66059](https://github.com/PolymathNetwork/polymesh-wallet/commit/dd66059dd2337513019a6d75a3a53e462eefd5fa))
* **CI:** use semantic release ([#212](https://github.com/PolymathNetwork/polymesh-wallet/issues/212)) ([f96610e](https://github.com/PolymathNetwork/polymesh-wallet/commit/f96610eb87fbcff3e90b0c5f1f894a1e3e4a1669)), closes [#58](https://github.com/PolymathNetwork/polymesh-wallet/issues/58) [#211](https://github.com/PolymathNetwork/polymesh-wallet/issues/211) [#204](https://github.com/PolymathNetwork/polymesh-wallet/issues/204) [#203](https://github.com/PolymathNetwork/polymesh-wallet/issues/203) [#210](https://github.com/PolymathNetwork/polymesh-wallet/issues/210) [#205](https://github.com/PolymathNetwork/polymesh-wallet/issues/205) [#198](https://github.com/PolymathNetwork/polymesh-wallet/issues/198) [#206](https://github.com/PolymathNetwork/polymesh-wallet/issues/206)
* context menu (WAL-45) ([a186cde](https://github.com/PolymathNetwork/polymesh-wallet/commit/a186cde858845b2e9bc979f77d84eff8b82c7114))
* dashboard link ([3b464b3](https://github.com/PolymathNetwork/polymesh-wallet/commit/3b464b33d8b4d05e1a082b8af28dd34cf5a02da5))
* export account ([2250ef2](https://github.com/PolymathNetwork/polymesh-wallet/commit/2250ef278644cb2d1e0242e3eed75b562d620618))
* Field validation when user entering new password (WAL-61) ([d9b33f0](https://github.com/PolymathNetwork/polymesh-wallet/commit/d9b33f08ad95c77c7310ae9058395e78006f18ce))
* Field validation when user entering new password (WAL-61). ([3676d26](https://github.com/PolymathNetwork/polymesh-wallet/commit/3676d26427d05e45fed0499c24bc5b010da48677))
* global isBusy listener ([99ab810](https://github.com/PolymathNetwork/polymesh-wallet/commit/99ab81073d1c09e0a0c7951be01c614821689a43))
* highlight texts based on troubleshoot step ([d101622](https://github.com/PolymathNetwork/polymesh-wallet/commit/d101622463e1cde2833740b5a6e7f72f3f3d8af8))
* Hr component ([5b091ee](https://github.com/PolymathNetwork/polymesh-wallet/commit/5b091ee4bdae981ec0c3e484a5e5ed11ee315b96))
* import account json ([c66fdeb](https://github.com/PolymathNetwork/polymesh-wallet/commit/c66fdeb1df80644f7198680a2438127032db74d3))
* import json ([bfb425a](https://github.com/PolymathNetwork/polymesh-wallet/commit/bfb425a19cb2e94339ddeaf21389674b57234b94))
* import json loading indicator(WAL-36) ([0881f37](https://github.com/PolymathNetwork/polymesh-wallet/commit/0881f37d2deb0b7e38b05cb82110eaec0597b7ac))
* import json wip ([817b3bb](https://github.com/PolymathNetwork/polymesh-wallet/commit/817b3bbfc0a191e749dd592325dee60d93ebf7c5))
* import seed loading indicator (WAL-36) ([b164846](https://github.com/PolymathNetwork/polymesh-wallet/commit/b164846014e02dbca3b0a5fe0983ad7d66b4f4fb))
* in-place identity alias editor (WAL-34) ([c1bef4c](https://github.com/PolymathNetwork/polymesh-wallet/commit/c1bef4c21c74e735121fdb12c24456a8af1448b7))
* loading indicator (WAL-36) ([20abb95](https://github.com/PolymathNetwork/polymesh-wallet/commit/20abb95134d46966ce131f811c72d7f50fa2ed7a))
* password component ([28811c6](https://github.com/PolymathNetwork/polymesh-wallet/commit/28811c6f1d6f4e00f648999c6465c3fbeb4e6b16))
* restructure account import screens ([d93966a](https://github.com/PolymathNetwork/polymesh-wallet/commit/d93966ad756172376f3e1e26861111de97e8f175))
* reuse password container in new account form ([b8275a3](https://github.com/PolymathNetwork/polymesh-wallet/commit/b8275a359a7ddd162dc0c2c7cb53d9ef454aac88))
* show name and initials ([2c46b38](https://github.com/PolymathNetwork/polymesh-wallet/commit/2c46b38a47759186c0adb67588724bd3bbc83147))
* toggle advanced settings dropdown ([0396fb8](https://github.com/PolymathNetwork/polymesh-wallet/commit/0396fb8a40699adf1776f77a786cffe1405bd496))
* **UI:** network selector update [GTN-346] ([#205](https://github.com/PolymathNetwork/polymesh-wallet/issues/205)) ([d62f173](https://github.com/PolymathNetwork/polymesh-wallet/commit/d62f17313e6c51d11f817561d0a486b7dc71e2c3))
* **UI:** new Polymesh theme [WAL-168] ([#198](https://github.com/PolymathNetwork/polymesh-wallet/issues/198)) ([a51e011](https://github.com/PolymathNetwork/polymesh-wallet/commit/a51e0114bc506e81722ecc4e498c57703f0e58ad))
* **UI:** update main menu UI [GTN-344] ([#206](https://github.com/PolymathNetwork/polymesh-wallet/issues/206)) ([8a47d3c](https://github.com/PolymathNetwork/polymesh-wallet/commit/8a47d3c0eb88be7475bf73d00694d92357ae4b67))
* unlock uid ([b2cfe25](https://github.com/PolymathNetwork/polymesh-wallet/commit/b2cfe256bf606f2284d89c2597a50f3a23881370))
* update open-application troubleshoot guide styling ([e8581be](https://github.com/PolymathNetwork/polymesh-wallet/commit/e8581be9446870aa04ceddae002ec54018e24089))
* use css grids to align items for AccountView ([e33c34f](https://github.com/PolymathNetwork/polymesh-wallet/commit/e33c34f7b0f6b470a7521102fdf8c260493bdc9a))
* use password component to import seed ([8139e69](https://github.com/PolymathNetwork/polymesh-wallet/commit/8139e69f25e798d5430d7c6cb44e72b21524a683))
* validate and save account ([22edc39](https://github.com/PolymathNetwork/polymesh-wallet/commit/22edc39d4a57109a79d8be549216dd04e308d361))
* wip - name component ([c4b4f7e](https://github.com/PolymathNetwork/polymesh-wallet/commit/c4b4f7eecaca24896232e4a0047ea83fbaf28854))

# [1.3.0](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.2.1...1.3.0) (2021-09-29)


### Bug Fixes

* disable husky during release ([e94ea2b](https://github.com/PolymathNetwork/polymesh-wallet/commit/e94ea2bade1ffe12bd3a784c68092ee5185b606d))
* remove obligatory commitizen for commit msgs ([70452b8](https://github.com/PolymathNetwork/polymesh-wallet/commit/70452b8b8284250892c447c6901cbdb248ed1e43))


### Features

* add husky + commitlint ([9f13793](https://github.com/PolymathNetwork/polymesh-wallet/commit/9f137938bf2db24ff8b355337aec023ad6a49fbc))

## [1.2.1](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.2.0...1.2.1) (2021-09-29)


### Bug Fixes

* add success script to squash commits ([1d4cc6d](https://github.com/PolymathNetwork/polymesh-wallet/commit/1d4cc6d37c8188c5a9c33af9cdfd08ac851bb446))
* pull latest in script ([f3dd3e5](https://github.com/PolymathNetwork/polymesh-wallet/commit/f3dd3e5f374b07b045ab7213dd3a41f990c8449b))

# [1.2.0](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.1.0...1.2.0) (2021-09-29)


### Bug Fixes

* add build step ([4e6fa0a](https://github.com/PolymathNetwork/polymesh-wallet/commit/4e6fa0ac925f189f14a224dfd462589c7f576b29))
* add commit-versions script ([ac6cbf1](https://github.com/PolymathNetwork/polymesh-wallet/commit/ac6cbf1fb37dd83943a2f48e3dc8b7daa6a8961b))
* add git add . ([ab261b5](https://github.com/PolymathNetwork/polymesh-wallet/commit/ab261b544ba4d107fd4be735a31c31462893b167))
* add git push ([4fd6d89](https://github.com/PolymathNetwork/polymesh-wallet/commit/4fd6d897f8444c2fd152e872b298a1882964eb06))
* add git push ([b52e46e](https://github.com/PolymathNetwork/polymesh-wallet/commit/b52e46efaa5dd6fb5fc953d3a5621ea6021074c6))
* bump-versions script ([6f7244c](https://github.com/PolymathNetwork/polymesh-wallet/commit/6f7244c1bd5809edbfc59c17677be71173efddc5))
* change exec commands order ([e6b95e8](https://github.com/PolymathNetwork/polymesh-wallet/commit/e6b95e877ff27301f3442dfa1b8f67464c02fc0a))
* commit workspaces version bumps ([8d82f5c](https://github.com/PolymathNetwork/polymesh-wallet/commit/8d82f5c1dfb1bcfb0912f495f934127c0be430bb))
* consolidate scripts into bump-versions ([3892172](https://github.com/PolymathNetwork/polymesh-wallet/commit/3892172c8f1989ae8abe39cb561e555ed2909587))
* disable npm plugin and use exec to update package versions ([622abf5](https://github.com/PolymathNetwork/polymesh-wallet/commit/622abf5ed090c8a8054c7b802f49e20d7721d075))
* exec step ([f1488b9](https://github.com/PolymathNetwork/polymesh-wallet/commit/f1488b914c80bb172c0f906f19b0cbdb5aa62e5d))
* exec step ([5d7a122](https://github.com/PolymathNetwork/polymesh-wallet/commit/5d7a122bf12db87a585878306ad853bf89671c15))
* re-enable publish exec script ([93e9e01](https://github.com/PolymathNetwork/polymesh-wallet/commit/93e9e019ea2d8901fdccea4880f3d770fe506f4a))
* test exec build ([be990e9](https://github.com/PolymathNetwork/polymesh-wallet/commit/be990e924901f7f7e24e22102bb155f02ce6fd3d))
* test script update ([51b95fd](https://github.com/PolymathNetwork/polymesh-wallet/commit/51b95fdbeee0ed983c6803df38e6f7f4effd6ce8))
* test scripts ([faf7211](https://github.com/PolymathNetwork/polymesh-wallet/commit/faf7211f541c3989ec414b18c240a1e28b7b0493))
* update bump-versions script ([eb26b35](https://github.com/PolymathNetwork/polymesh-wallet/commit/eb26b35df9344a424390699cbfc8482b43a43d6d))
* use bump-versions script ([ebabc56](https://github.com/PolymathNetwork/polymesh-wallet/commit/ebabc56d6ce60462e082c1d52a1f08243cb16cb0))
* use npm again ([377a672](https://github.com/PolymathNetwork/polymesh-wallet/commit/377a672e3bad030bd0ed4bf5156f5cd0c3954c39))


### Features

* add bump-version script ([432090a](https://github.com/PolymathNetwork/polymesh-wallet/commit/432090a429c91a78c33f1654c7f8355d83f7c264))
* use npm to bump workspace versions ([8f78858](https://github.com/PolymathNetwork/polymesh-wallet/commit/8f78858026854e48b5d6b1fa5f5ce031dd74be99))

# [1.1.0](https://github.com/PolymathNetwork/polymesh-wallet/compare/1.0.0...1.1.0) (2021-09-29)


### Bug Fixes

* add missing packages ([3088560](https://github.com/PolymathNetwork/polymesh-wallet/commit/3088560ead09af5e357b670fbfc191032a2c7d56))
* **CI:** release plugin order ([7bc54a5](https://github.com/PolymathNetwork/polymesh-wallet/commit/7bc54a58adc9f8f01ba67a94733d9a2cc3e581a2))
* prevent PR/issue comments ([05b7ad3](https://github.com/PolymathNetwork/polymesh-wallet/commit/05b7ad3c6c3e7236fd8536a034ee2ce060cc3fa2))
* **release:** use publishCmd for exec ([c5c00c5](https://github.com/PolymathNetwork/polymesh-wallet/commit/c5c00c5dc4dfc396c12868987730b031f3ea71dc))
* test with non prepublish ([7175046](https://github.com/PolymathNetwork/polymesh-wallet/commit/7175046725de3ca4cd30ad42b9a797b9aa1999bf))
* update tag format ([770bb7f](https://github.com/PolymathNetwork/polymesh-wallet/commit/770bb7f902e5aad82f85671431d3dd47258416c0))


### Features

* semantic-release ([cac0e4b](https://github.com/PolymathNetwork/polymesh-wallet/commit/cac0e4b359cf23e1e387acf94ae32e71c985c6ac))

# [1.0.0-semantic-release.4](https://github.com/PolymathNetwork/polymesh-wallet/compare/v1.0.0-semantic-release.3...1.0.0-semantic-release.4) (2021-09-29)


### Bug Fixes

* update tag format ([770bb7f](https://github.com/PolymathNetwork/polymesh-wallet/commit/770bb7f902e5aad82f85671431d3dd47258416c0))

# [1.0.0-semantic-release.3](https://github.com/PolymathNetwork/polymesh-wallet/compare/v1.0.0-semantic-release.2...v1.0.0-semantic-release.3) (2021-09-28)


### Bug Fixes

* **CI:** release plugin order ([7bc54a5](https://github.com/PolymathNetwork/polymesh-wallet/commit/7bc54a58adc9f8f01ba67a94733d9a2cc3e581a2))

# [1.0.0-semantic-release.2](https://github.com/PolymathNetwork/polymesh-wallet/compare/v1.0.0-semantic-release.1...v1.0.0-semantic-release.2) (2021-09-28)


### Bug Fixes

* prevent PR/issue comments ([05b7ad3](https://github.com/PolymathNetwork/polymesh-wallet/commit/05b7ad3c6c3e7236fd8536a034ee2ce060cc3fa2))

# 1.0.0-semantic-release.1 (2021-09-28)


### Bug Fixes

* account selected when assign is clicked ([c953ee7](https://github.com/PolymathNetwork/polymesh-wallet/commit/c953ee7bd368e666cbe1256bb6f4eee8ee564a44))
* Account table is showing on top of the top panel (WAL-53) ([0ec70a8](https://github.com/PolymathNetwork/polymesh-wallet/commit/0ec70a8b5eadcd5b17b4bc09419bd2dd4adcc8db))
* add background color to account card to make it not-transparent ([c3aea9c](https://github.com/PolymathNetwork/polymesh-wallet/commit/c3aea9c15e6142a7b87cbdcecede963efefe222d))
* add grid area definition for unassigned accounts on hover ([e9fb061](https://github.com/PolymathNetwork/polymesh-wallet/commit/e9fb061cc02291321e7b34ccb6a80b82b1819625))
* add icon for verified and fix alignment ([9b12399](https://github.com/PolymathNetwork/polymesh-wallet/commit/9b123997ae688718777ef6407e5da7f7dfb17d1c))
* add missing packages ([3088560](https://github.com/PolymathNetwork/polymesh-wallet/commit/3088560ead09af5e357b670fbfc191032a2c7d56))
* add specified width for `name`'s wrapping element ([a323637](https://github.com/PolymathNetwork/polymesh-wallet/commit/a3236375137eedc91470c3b3ac5041b9b6a0a12b))
* alias editing textfield unnecessarily tall (MER-46) ([f8b5541](https://github.com/PolymathNetwork/polymesh-wallet/commit/f8b5541e9bc57ff81f3ae6d57a5bc04f22a185a0))
* all copy icons that appear on hover never disappear, on blur (MER-46) ([4f9f7b1](https://github.com/PolymathNetwork/polymesh-wallet/commit/4f9f7b1e0b2e58bcaaa7eb2fa01fd4dbe2453e52))
* allow scrolling only to see expandable details ([8387cde](https://github.com/PolymathNetwork/polymesh-wallet/commit/8387cde57d030a3b7d69f9f1f4754a8685915e84))
* build error ([f7d3b21](https://github.com/PolymathNetwork/polymesh-wallet/commit/f7d3b211215231a989f6b8b9ad6be8b473e6bdac))
* build error ([c2eb3af](https://github.com/PolymathNetwork/polymesh-wallet/commit/c2eb3af4759f67506571b8a4acc1e04c953ddb28))
* build error ([8b7e916](https://github.com/PolymathNetwork/polymesh-wallet/commit/8b7e916aed33a3485c25f3873326f096f9b79572))
* build error ([2c11624](https://github.com/PolymathNetwork/polymesh-wallet/commit/2c11624df232ed650b0054f6f614128c5e4ec753))
* build error ([3e16f5a](https://github.com/PolymathNetwork/polymesh-wallet/commit/3e16f5a416b1436798060ebfbe29404c514b1394))
* build error ([44f5c8c](https://github.com/PolymathNetwork/polymesh-wallet/commit/44f5c8c4cc49074c77233681bfe63233cb5a33f1))
* capitalization ([3ad776c](https://github.com/PolymathNetwork/polymesh-wallet/commit/3ad776c775777529080a5989e908a04d4bcfd573))
* capitalization (WAL-86) ([#58](https://github.com/PolymathNetwork/polymesh-wallet/issues/58)) ([661a98c](https://github.com/PolymathNetwork/polymesh-wallet/commit/661a98cb5757af712ca81064038365a18a2adf47))
* center image ([7063106](https://github.com/PolymathNetwork/polymesh-wallet/commit/70631065c3cafb654139da5510b7266bd77beb22))
* change new account labels on 'add key' to be consistent (WAL-57) ([12a1720](https://github.com/PolymathNetwork/polymesh-wallet/commit/12a1720f172c0b7275f09aa9f6e10fcc3287b255))
* change password of imported. account ([ec1a8ff](https://github.com/PolymathNetwork/polymesh-wallet/commit/ec1a8ff96f0078d06f232b07453fa3fb739a40a9))
* clicking on copy triggers account selection ([1f5e40b](https://github.com/PolymathNetwork/polymesh-wallet/commit/1f5e40bbe4d96cf0364b85d1860519a66be7e921))
* compare network ([7651a97](https://github.com/PolymathNetwork/polymesh-wallet/commit/7651a97394af06912e99444fd5401589a342dd2e))
* copy indicator (WAL-54) ([db10c88](https://github.com/PolymathNetwork/polymesh-wallet/commit/db10c880f6c5a5fa6670c732e9ef9c3ee9acef0e))
* copy tooltip position ([9451de8](https://github.com/PolymathNetwork/polymesh-wallet/commit/9451de81e506788e7c969b9bc02629845c04348c))
* did alias input height ([9ce487b](https://github.com/PolymathNetwork/polymesh-wallet/commit/9ce487b679a0624cedc928feec771daad7d2342a))
* downgrade packages to work with ITN Rewards [GTN-2084] ([#211](https://github.com/PolymathNetwork/polymesh-wallet/issues/211)) ([d2d87a7](https://github.com/PolymathNetwork/polymesh-wallet/commit/d2d87a747096392909c6f059748597039a0b49cd))
* ellipsize text overflow for name display in account details ([f28a82f](https://github.com/PolymathNetwork/polymesh-wallet/commit/f28a82ff95ac2862a265402e43b79177204ccbf8))
* event propagation of edit account links ([0dd07c6](https://github.com/PolymathNetwork/polymesh-wallet/commit/0dd07c692aacf78672566435c7267d3619227eee))
* generate proof ui ([85a2875](https://github.com/PolymathNetwork/polymesh-wallet/commit/85a2875e77ff41aa8ef19b6fbec437a12c13f612))
* lint ([c9d3d02](https://github.com/PolymathNetwork/polymesh-wallet/commit/c9d3d0248ec1d127b316116c86a728133afa246d))
* lint error ([60923f0](https://github.com/PolymathNetwork/polymesh-wallet/commit/60923f0f2c0398852d49cf6aec2f1994b2e3e762))
* lint errors ([443e708](https://github.com/PolymathNetwork/polymesh-wallet/commit/443e70890fdcee4c0aaa352a68205c4be1baeff4))
* lint errors ([c33ce13](https://github.com/PolymathNetwork/polymesh-wallet/commit/c33ce13bb149f1063d6386f5f9674c8831e60e6b))
* lint issue (alphabetical props) ([c1d665c](https://github.com/PolymathNetwork/polymesh-wallet/commit/c1d665c304cc815fa5d7fd9328a938bc068723dd))
* lint issues ([f15a914](https://github.com/PolymathNetwork/polymesh-wallet/commit/f15a914b59868500d735d2f2fa7d21f02c45749e))
* make equal size reject/sign buttons ([e79b0c4](https://github.com/PolymathNetwork/polymesh-wallet/commit/e79b0c49bc646d5b99d2cfacd06eee5b9613c505))
* menu for unassigned account ([44a495e](https://github.com/PolymathNetwork/polymesh-wallet/commit/44a495e7c1a50c5df48f2578ef419e39cc430b02))
* menu not rendering for header menu items ([1967f41](https://github.com/PolymathNetwork/polymesh-wallet/commit/1967f412223dfbbaec40a0ac0571f376f3f3942a))
* network change bug ([#204](https://github.com/PolymathNetwork/polymesh-wallet/issues/204)) ([26a6d4d](https://github.com/PolymathNetwork/polymesh-wallet/commit/26a6d4d36fc496e45b11653f0c2cb00b53441f48))
* pass build ([54a3a2f](https://github.com/PolymathNetwork/polymesh-wallet/commit/54a3a2fe4cda7764bc2b0dc1827915deb2201f62))
* refactor api connection ([#203](https://github.com/PolymathNetwork/polymesh-wallet/issues/203)) ([82746d7](https://github.com/PolymathNetwork/polymesh-wallet/commit/82746d7b26fec5ff00507e7d505852bd4856aecc))
* Remove intro screen for new user (WAL-58) ([27454a7](https://github.com/PolymathNetwork/polymesh-wallet/commit/27454a78164872a48dc269aa20e4c23abea98214))
* remove memoization to make type/index selections work properly ([a72a7f3](https://github.com/PolymathNetwork/polymesh-wallet/commit/a72a7f3e50b20622059b9259232b4a6fc8a20c72))
* remove trailing bredcrumb line ([e03e7e2](https://github.com/PolymathNetwork/polymesh-wallet/commit/e03e7e2872ed0203ed38097654c109c289768f74))
* remove unused dependencies ([03e1a5a](https://github.com/PolymathNetwork/polymesh-wallet/commit/03e1a5af5f42e0de07c0646e17e235b771eb745f))
* revert back to orignal renders ([96e2ea2](https://github.com/PolymathNetwork/polymesh-wallet/commit/96e2ea2174ee335f6683a872554ca82e2427456c))
* temporarily disable network mismatch detection ([#210](https://github.com/PolymathNetwork/polymesh-wallet/issues/210)) ([09563c9](https://github.com/PolymathNetwork/polymesh-wallet/commit/09563c9730e4e43fd2d97275edfefda9a04eeba8))
* update copy “Authorize” to “Sign” ([bc7cffb](https://github.com/PolymathNetwork/polymesh-wallet/commit/bc7cffba4e0e1868a37d64f3001af524843a1d4c))
* update fallback schemas ([5f01948](https://github.com/PolymathNetwork/polymesh-wallet/commit/5f01948aab7ba8a76560b748b911c10520aae659))
* update margins, colors, opacity ([538abb4](https://github.com/PolymathNetwork/polymesh-wallet/commit/538abb482ef20a3abe7eea8b0cd2cb60f6a79386))
* update test, change copy ([e9843cd](https://github.com/PolymathNetwork/polymesh-wallet/commit/e9843cd790260909775ecac0d5fb4cceb471da8b))
* use `minWidth` for `name`'s wrapping element instead ([b8ac2c4](https://github.com/PolymathNetwork/polymesh-wallet/commit/b8ac2c458dc7f5285dc7b0ba2958f6044e213780))
* use `TextOverflowEllipsis` for displaying name in `AccountHeader` ([77dc283](https://github.com/PolymathNetwork/polymesh-wallet/commit/77dc2830bd64049f5e41c7f9cd6c0ef818cdb2be))


### Features

* account details view (WAL-43) ([690090e](https://github.com/PolymathNetwork/polymesh-wallet/commit/690090eb489d4a1fb6636d16e404c131a0f61cfd))
* account uid view ([b85484c](https://github.com/PolymathNetwork/polymesh-wallet/commit/b85484c9e6e8d8032230300c4821a5360eff8b22))
* add "attention" info when adding new account ([2263608](https://github.com/PolymathNetwork/polymesh-wallet/commit/2263608e579d8694adfed78fa71df5b4775972df))
* add busy prop to button ([b166b02](https://github.com/PolymathNetwork/polymesh-wallet/commit/b166b021b5beb5501c2a7d4bed9aee2111541767))
* add header ([4afc138](https://github.com/PolymathNetwork/polymesh-wallet/commit/4afc13875608a3147722f57331bbfbf99ae128e9))
* add images ([6a821e0](https://github.com/PolymathNetwork/polymesh-wallet/commit/6a821e0f0e60dc1f28dcc58ba90e4819ca1212e6))
* add ledger icon to refresh button, refactor UI ([f1ea04f](https://github.com/PolymathNetwork/polymesh-wallet/commit/f1ea04f6ce86a065a02f885c18e23e49ca29e57d))
* add open lock icon ([8eda0d9](https://github.com/PolymathNetwork/polymesh-wallet/commit/8eda0d9394d82ea3792bd20caf4c81bbec2d3352))
* add styled step-list ([463ed73](https://github.com/PolymathNetwork/polymesh-wallet/commit/463ed739428bf922a0b25b979fa6a203d7686157))
* add TextOverflowEllipsis component ([5d8c2ee](https://github.com/PolymathNetwork/polymesh-wallet/commit/5d8c2eeff4de2b985157a8c4f603f9a4510532b2))
* add tooltip component ([88f3ce1](https://github.com/PolymathNetwork/polymesh-wallet/commit/88f3ce1106f3bbda8d0f20f7d1f791f062f9994b))
* assign button link to dashboard (WAL-44) ([20b916c](https://github.com/PolymathNetwork/polymesh-wallet/commit/20b916cc0ef27c80d5c0e4fe4f2e4f3839072d08))
* cancel button ([9814d5d](https://github.com/PolymathNetwork/polymesh-wallet/commit/9814d5d06a36b50b850933f67762e039737629c6))
* change default placeholder text for password when adding a new account ([3e7807e](https://github.com/PolymathNetwork/polymesh-wallet/commit/3e7807e5841dcf821369b71eb3bf4c8169728040))
* change password ([dd66059](https://github.com/PolymathNetwork/polymesh-wallet/commit/dd66059dd2337513019a6d75a3a53e462eefd5fa))
* context menu (WAL-45) ([a186cde](https://github.com/PolymathNetwork/polymesh-wallet/commit/a186cde858845b2e9bc979f77d84eff8b82c7114))
* dashboard link ([3b464b3](https://github.com/PolymathNetwork/polymesh-wallet/commit/3b464b33d8b4d05e1a082b8af28dd34cf5a02da5))
* export account ([2250ef2](https://github.com/PolymathNetwork/polymesh-wallet/commit/2250ef278644cb2d1e0242e3eed75b562d620618))
* Field validation when user entering new password (WAL-61) ([d9b33f0](https://github.com/PolymathNetwork/polymesh-wallet/commit/d9b33f08ad95c77c7310ae9058395e78006f18ce))
* Field validation when user entering new password (WAL-61). ([3676d26](https://github.com/PolymathNetwork/polymesh-wallet/commit/3676d26427d05e45fed0499c24bc5b010da48677))
* global isBusy listener ([99ab810](https://github.com/PolymathNetwork/polymesh-wallet/commit/99ab81073d1c09e0a0c7951be01c614821689a43))
* highlight texts based on troubleshoot step ([d101622](https://github.com/PolymathNetwork/polymesh-wallet/commit/d101622463e1cde2833740b5a6e7f72f3f3d8af8))
* Hr component ([5b091ee](https://github.com/PolymathNetwork/polymesh-wallet/commit/5b091ee4bdae981ec0c3e484a5e5ed11ee315b96))
* import account json ([c66fdeb](https://github.com/PolymathNetwork/polymesh-wallet/commit/c66fdeb1df80644f7198680a2438127032db74d3))
* import json ([bfb425a](https://github.com/PolymathNetwork/polymesh-wallet/commit/bfb425a19cb2e94339ddeaf21389674b57234b94))
* import json loading indicator(WAL-36) ([0881f37](https://github.com/PolymathNetwork/polymesh-wallet/commit/0881f37d2deb0b7e38b05cb82110eaec0597b7ac))
* import json wip ([817b3bb](https://github.com/PolymathNetwork/polymesh-wallet/commit/817b3bbfc0a191e749dd592325dee60d93ebf7c5))
* import seed loading indicator (WAL-36) ([b164846](https://github.com/PolymathNetwork/polymesh-wallet/commit/b164846014e02dbca3b0a5fe0983ad7d66b4f4fb))
* in-place identity alias editor (WAL-34) ([c1bef4c](https://github.com/PolymathNetwork/polymesh-wallet/commit/c1bef4c21c74e735121fdb12c24456a8af1448b7))
* loading indicator (WAL-36) ([20abb95](https://github.com/PolymathNetwork/polymesh-wallet/commit/20abb95134d46966ce131f811c72d7f50fa2ed7a))
* password component ([28811c6](https://github.com/PolymathNetwork/polymesh-wallet/commit/28811c6f1d6f4e00f648999c6465c3fbeb4e6b16))
* restructure account import screens ([d93966a](https://github.com/PolymathNetwork/polymesh-wallet/commit/d93966ad756172376f3e1e26861111de97e8f175))
* reuse password container in new account form ([b8275a3](https://github.com/PolymathNetwork/polymesh-wallet/commit/b8275a359a7ddd162dc0c2c7cb53d9ef454aac88))
* semantic-release ([cac0e4b](https://github.com/PolymathNetwork/polymesh-wallet/commit/cac0e4b359cf23e1e387acf94ae32e71c985c6ac))
* show name and initials ([2c46b38](https://github.com/PolymathNetwork/polymesh-wallet/commit/2c46b38a47759186c0adb67588724bd3bbc83147))
* toggle advanced settings dropdown ([0396fb8](https://github.com/PolymathNetwork/polymesh-wallet/commit/0396fb8a40699adf1776f77a786cffe1405bd496))
* **UI:** network selector update [GTN-346] ([#205](https://github.com/PolymathNetwork/polymesh-wallet/issues/205)) ([d62f173](https://github.com/PolymathNetwork/polymesh-wallet/commit/d62f17313e6c51d11f817561d0a486b7dc71e2c3))
* **UI:** new Polymesh theme [WAL-168] ([#198](https://github.com/PolymathNetwork/polymesh-wallet/issues/198)) ([a51e011](https://github.com/PolymathNetwork/polymesh-wallet/commit/a51e0114bc506e81722ecc4e498c57703f0e58ad))
* **UI:** update main menu UI [GTN-344] ([#206](https://github.com/PolymathNetwork/polymesh-wallet/issues/206)) ([8a47d3c](https://github.com/PolymathNetwork/polymesh-wallet/commit/8a47d3c0eb88be7475bf73d00694d92357ae4b67))
* unlock uid ([b2cfe25](https://github.com/PolymathNetwork/polymesh-wallet/commit/b2cfe256bf606f2284d89c2597a50f3a23881370))
* update open-application troubleshoot guide styling ([e8581be](https://github.com/PolymathNetwork/polymesh-wallet/commit/e8581be9446870aa04ceddae002ec54018e24089))
* use css grids to align items for AccountView ([e33c34f](https://github.com/PolymathNetwork/polymesh-wallet/commit/e33c34f7b0f6b470a7521102fdf8c260493bdc9a))
* use password component to import seed ([8139e69](https://github.com/PolymathNetwork/polymesh-wallet/commit/8139e69f25e798d5430d7c6cb44e72b21524a683))
* validate and save account ([22edc39](https://github.com/PolymathNetwork/polymesh-wallet/commit/22edc39d4a57109a79d8be549216dd04e308d361))
* wip - name component ([c4b4f7e](https://github.com/PolymathNetwork/polymesh-wallet/commit/c4b4f7eecaca24896232e4a0047ea83fbaf28854))
