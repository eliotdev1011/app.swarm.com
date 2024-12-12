/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: string; output: string; }
  BigInt: { input: string; output: string; }
  Bytes: { input: string; output: string; }
  /**
   * 8 bytes signed integer
   *
   */
  Int8: { input: number; output: number; }
  /**
   * A string representation of microseconds UNIX timestamp (16 digits)
   *
   */
  Timestamp: { input: number; output: number; }
};

export enum AggregationInterval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type BlockHeight = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type DotcAsset = {
  __typename?: 'DotcAsset';
  address: Scalars['String']['output'];
  asset?: Maybe<Sx1155TokenId>;
  assetData?: Maybe<KyaData>;
  assetType?: Maybe<Sx1155AssetType>;
  decimals?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  tokenId?: Maybe<Scalars['Int']['output']>;
  tradedVolume: Scalars['BigDecimal']['output'];
  type: Scalars['Int']['output'];
};

export type DotcAssetFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<DotcAssetFilter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  assetData?: InputMaybe<Scalars['String']['input']>;
  assetData_?: InputMaybe<KyaDataFilter>;
  assetData_contains?: InputMaybe<Scalars['String']['input']>;
  assetData_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetData_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetData_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetData_gt?: InputMaybe<Scalars['String']['input']>;
  assetData_gte?: InputMaybe<Scalars['String']['input']>;
  assetData_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetData_lt?: InputMaybe<Scalars['String']['input']>;
  assetData_lte?: InputMaybe<Scalars['String']['input']>;
  assetData_not?: InputMaybe<Scalars['String']['input']>;
  assetData_not_contains?: InputMaybe<Scalars['String']['input']>;
  assetData_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetData_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetData_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetData_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetData_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetData_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetData_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetData_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetType?: InputMaybe<Sx1155AssetType>;
  assetType_in?: InputMaybe<Array<Sx1155AssetType>>;
  assetType_not?: InputMaybe<Sx1155AssetType>;
  assetType_not_in?: InputMaybe<Array<Sx1155AssetType>>;
  asset_?: InputMaybe<Sx1155TokenIdFilter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<DotcAssetFilter>>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['Int']['input']>;
  tokenId_gt?: InputMaybe<Scalars['Int']['input']>;
  tokenId_gte?: InputMaybe<Scalars['Int']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['Int']['input']>;
  tokenId_lte?: InputMaybe<Scalars['Int']['input']>;
  tokenId_not?: InputMaybe<Scalars['Int']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tradedVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradedVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradedVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradedVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tradedVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradedVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradedVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tradedVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  type?: InputMaybe<Scalars['Int']['input']>;
  type_gt?: InputMaybe<Scalars['Int']['input']>;
  type_gte?: InputMaybe<Scalars['Int']['input']>;
  type_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  type_lt?: InputMaybe<Scalars['Int']['input']>;
  type_lte?: InputMaybe<Scalars['Int']['input']>;
  type_not?: InputMaybe<Scalars['Int']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum DotcAssetOrderBy {
  Address = 'address',
  Asset = 'asset',
  AssetData = 'assetData',
  AssetDataAssetTicker = 'assetData__assetTicker',
  AssetDataAssetType = 'assetData__assetType',
  AssetDataBlockchain = 'assetData__blockchain',
  AssetDataCustodian = 'assetData__custodian',
  AssetDataDescription = 'assetData__description',
  AssetDataEditionNumber = 'assetData__editionNumber',
  AssetDataExternalUrl = 'assetData__externalURL',
  AssetDataId = 'assetData__id',
  AssetDataImageUrl = 'assetData__imageURL',
  AssetDataIssuer = 'assetData__issuer',
  AssetDataLocation = 'assetData__location',
  AssetDataName = 'assetData__name',
  AssetDataPurity = 'assetData__purity',
  AssetDataSerialNumber = 'assetData__serialNumber',
  AssetDataSymbol = 'assetData__symbol',
  AssetDataWeight = 'assetData__weight',
  AssetType = 'assetType',
  AssetUri = 'asset__URI',
  AssetAssetType = 'asset__assetType',
  AssetAuthorization = 'asset__authorization',
  AssetId = 'asset__id',
  AssetKya = 'asset__kya',
  AssetOpenTransferRequestsCount = 'asset__openTransferRequestsCount',
  AssetSupply = 'asset__supply',
  AssetTransferRequestsCount = 'asset__transferRequestsCount',
  Decimals = 'decimals',
  Id = 'id',
  Name = 'name',
  Symbol = 'symbol',
  TokenId = 'tokenId',
  TradedVolume = 'tradedVolume',
  Type = 'type'
}

export type KyaData = {
  __typename?: 'KyaData';
  assetTicker?: Maybe<Scalars['String']['output']>;
  assetType?: Maybe<Sx1155AssetType>;
  blockchain?: Maybe<Scalars['String']['output']>;
  custodian?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  editionNumber?: Maybe<Scalars['Int']['output']>;
  externalURL?: Maybe<Scalars['String']['output']>;
  /** KYA IPFS hash */
  id: Scalars['ID']['output'];
  imageURL?: Maybe<Scalars['String']['output']>;
  issuer?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nft?: Maybe<Sx1155Nft>;
  purity?: Maybe<Scalars['Int']['output']>;
  serialNumber?: Maybe<Scalars['Int']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  /** Id of NFT */
  tokenId?: Maybe<Sx1155TokenId>;
  weight?: Maybe<Scalars['String']['output']>;
};

export type KyaDataFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<KyaDataFilter>>>;
  assetTicker?: InputMaybe<Scalars['String']['input']>;
  assetTicker_contains?: InputMaybe<Scalars['String']['input']>;
  assetTicker_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetTicker_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetTicker_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetTicker_gt?: InputMaybe<Scalars['String']['input']>;
  assetTicker_gte?: InputMaybe<Scalars['String']['input']>;
  assetTicker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetTicker_lt?: InputMaybe<Scalars['String']['input']>;
  assetTicker_lte?: InputMaybe<Scalars['String']['input']>;
  assetTicker_not?: InputMaybe<Scalars['String']['input']>;
  assetTicker_not_contains?: InputMaybe<Scalars['String']['input']>;
  assetTicker_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetTicker_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetTicker_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetTicker_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetTicker_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetTicker_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetTicker_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetTicker_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetType?: InputMaybe<Sx1155AssetType>;
  assetType_in?: InputMaybe<Array<Sx1155AssetType>>;
  assetType_not?: InputMaybe<Sx1155AssetType>;
  assetType_not_in?: InputMaybe<Array<Sx1155AssetType>>;
  blockchain?: InputMaybe<Scalars['String']['input']>;
  blockchain_contains?: InputMaybe<Scalars['String']['input']>;
  blockchain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  blockchain_ends_with?: InputMaybe<Scalars['String']['input']>;
  blockchain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockchain_gt?: InputMaybe<Scalars['String']['input']>;
  blockchain_gte?: InputMaybe<Scalars['String']['input']>;
  blockchain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  blockchain_lt?: InputMaybe<Scalars['String']['input']>;
  blockchain_lte?: InputMaybe<Scalars['String']['input']>;
  blockchain_not?: InputMaybe<Scalars['String']['input']>;
  blockchain_not_contains?: InputMaybe<Scalars['String']['input']>;
  blockchain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  blockchain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  blockchain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockchain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  blockchain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  blockchain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockchain_starts_with?: InputMaybe<Scalars['String']['input']>;
  blockchain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  custodian?: InputMaybe<Scalars['String']['input']>;
  custodian_contains?: InputMaybe<Scalars['String']['input']>;
  custodian_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  custodian_ends_with?: InputMaybe<Scalars['String']['input']>;
  custodian_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  custodian_gt?: InputMaybe<Scalars['String']['input']>;
  custodian_gte?: InputMaybe<Scalars['String']['input']>;
  custodian_in?: InputMaybe<Array<Scalars['String']['input']>>;
  custodian_lt?: InputMaybe<Scalars['String']['input']>;
  custodian_lte?: InputMaybe<Scalars['String']['input']>;
  custodian_not?: InputMaybe<Scalars['String']['input']>;
  custodian_not_contains?: InputMaybe<Scalars['String']['input']>;
  custodian_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  custodian_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  custodian_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  custodian_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  custodian_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  custodian_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  custodian_starts_with?: InputMaybe<Scalars['String']['input']>;
  custodian_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  editionNumber?: InputMaybe<Scalars['Int']['input']>;
  editionNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  editionNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  editionNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  editionNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  editionNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  editionNumber_not?: InputMaybe<Scalars['Int']['input']>;
  editionNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  externalURL?: InputMaybe<Scalars['String']['input']>;
  externalURL_contains?: InputMaybe<Scalars['String']['input']>;
  externalURL_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  externalURL_ends_with?: InputMaybe<Scalars['String']['input']>;
  externalURL_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  externalURL_gt?: InputMaybe<Scalars['String']['input']>;
  externalURL_gte?: InputMaybe<Scalars['String']['input']>;
  externalURL_in?: InputMaybe<Array<Scalars['String']['input']>>;
  externalURL_lt?: InputMaybe<Scalars['String']['input']>;
  externalURL_lte?: InputMaybe<Scalars['String']['input']>;
  externalURL_not?: InputMaybe<Scalars['String']['input']>;
  externalURL_not_contains?: InputMaybe<Scalars['String']['input']>;
  externalURL_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  externalURL_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  externalURL_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  externalURL_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  externalURL_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  externalURL_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  externalURL_starts_with?: InputMaybe<Scalars['String']['input']>;
  externalURL_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  imageURL?: InputMaybe<Scalars['String']['input']>;
  imageURL_contains?: InputMaybe<Scalars['String']['input']>;
  imageURL_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  imageURL_ends_with?: InputMaybe<Scalars['String']['input']>;
  imageURL_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  imageURL_gt?: InputMaybe<Scalars['String']['input']>;
  imageURL_gte?: InputMaybe<Scalars['String']['input']>;
  imageURL_in?: InputMaybe<Array<Scalars['String']['input']>>;
  imageURL_lt?: InputMaybe<Scalars['String']['input']>;
  imageURL_lte?: InputMaybe<Scalars['String']['input']>;
  imageURL_not?: InputMaybe<Scalars['String']['input']>;
  imageURL_not_contains?: InputMaybe<Scalars['String']['input']>;
  imageURL_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  imageURL_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  imageURL_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  imageURL_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  imageURL_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  imageURL_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  imageURL_starts_with?: InputMaybe<Scalars['String']['input']>;
  imageURL_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer?: InputMaybe<Scalars['String']['input']>;
  issuer_contains?: InputMaybe<Scalars['String']['input']>;
  issuer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_ends_with?: InputMaybe<Scalars['String']['input']>;
  issuer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_gt?: InputMaybe<Scalars['String']['input']>;
  issuer_gte?: InputMaybe<Scalars['String']['input']>;
  issuer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer_lt?: InputMaybe<Scalars['String']['input']>;
  issuer_lte?: InputMaybe<Scalars['String']['input']>;
  issuer_not?: InputMaybe<Scalars['String']['input']>;
  issuer_not_contains?: InputMaybe<Scalars['String']['input']>;
  issuer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  issuer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  issuer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_starts_with?: InputMaybe<Scalars['String']['input']>;
  issuer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  location_contains?: InputMaybe<Scalars['String']['input']>;
  location_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  location_ends_with?: InputMaybe<Scalars['String']['input']>;
  location_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  location_gt?: InputMaybe<Scalars['String']['input']>;
  location_gte?: InputMaybe<Scalars['String']['input']>;
  location_in?: InputMaybe<Array<Scalars['String']['input']>>;
  location_lt?: InputMaybe<Scalars['String']['input']>;
  location_lte?: InputMaybe<Scalars['String']['input']>;
  location_not?: InputMaybe<Scalars['String']['input']>;
  location_not_contains?: InputMaybe<Scalars['String']['input']>;
  location_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  location_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  location_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  location_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  location_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  location_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  location_starts_with?: InputMaybe<Scalars['String']['input']>;
  location_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft?: InputMaybe<Scalars['String']['input']>;
  nft_?: InputMaybe<Sx1155NftFilter>;
  nft_contains?: InputMaybe<Scalars['String']['input']>;
  nft_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_ends_with?: InputMaybe<Scalars['String']['input']>;
  nft_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_gt?: InputMaybe<Scalars['String']['input']>;
  nft_gte?: InputMaybe<Scalars['String']['input']>;
  nft_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nft_lt?: InputMaybe<Scalars['String']['input']>;
  nft_lte?: InputMaybe<Scalars['String']['input']>;
  nft_not?: InputMaybe<Scalars['String']['input']>;
  nft_not_contains?: InputMaybe<Scalars['String']['input']>;
  nft_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  nft_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nft_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  nft_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_starts_with?: InputMaybe<Scalars['String']['input']>;
  nft_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<KyaDataFilter>>>;
  purity?: InputMaybe<Scalars['Int']['input']>;
  purity_gt?: InputMaybe<Scalars['Int']['input']>;
  purity_gte?: InputMaybe<Scalars['Int']['input']>;
  purity_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  purity_lt?: InputMaybe<Scalars['Int']['input']>;
  purity_lte?: InputMaybe<Scalars['Int']['input']>;
  purity_not?: InputMaybe<Scalars['Int']['input']>;
  purity_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  serialNumber?: InputMaybe<Scalars['Int']['input']>;
  serialNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  serialNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  serialNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  serialNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  serialNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  serialNumber_not?: InputMaybe<Scalars['Int']['input']>;
  serialNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  tokenId_?: InputMaybe<Sx1155TokenIdFilter>;
  tokenId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  tokenId_not?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['String']['input']>;
  weight_contains?: InputMaybe<Scalars['String']['input']>;
  weight_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  weight_ends_with?: InputMaybe<Scalars['String']['input']>;
  weight_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weight_gt?: InputMaybe<Scalars['String']['input']>;
  weight_gte?: InputMaybe<Scalars['String']['input']>;
  weight_in?: InputMaybe<Array<Scalars['String']['input']>>;
  weight_lt?: InputMaybe<Scalars['String']['input']>;
  weight_lte?: InputMaybe<Scalars['String']['input']>;
  weight_not?: InputMaybe<Scalars['String']['input']>;
  weight_not_contains?: InputMaybe<Scalars['String']['input']>;
  weight_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  weight_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  weight_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weight_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  weight_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  weight_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weight_starts_with?: InputMaybe<Scalars['String']['input']>;
  weight_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum KyaDataOrderBy {
  AssetTicker = 'assetTicker',
  AssetType = 'assetType',
  Blockchain = 'blockchain',
  Custodian = 'custodian',
  Description = 'description',
  EditionNumber = 'editionNumber',
  ExternalUrl = 'externalURL',
  Id = 'id',
  ImageUrl = 'imageURL',
  Issuer = 'issuer',
  Location = 'location',
  Name = 'name',
  Nft = 'nft',
  NftUri = 'nft__URI',
  NftActiveTokenIdsCount = 'nft__activeTokenIdsCount',
  NftAuthorization = 'nft__authorization',
  NftId = 'nft__id',
  NftKya = 'nft__kya',
  NftName = 'nft__name',
  NftPaused = 'nft__paused',
  NftSymbol = 'nft__symbol',
  NftTotalTokenIdsCount = 'nft__totalTokenIdsCount',
  Purity = 'purity',
  SerialNumber = 'serialNumber',
  Symbol = 'symbol',
  TokenId = 'tokenId',
  TokenIdUri = 'tokenId__URI',
  TokenIdAssetType = 'tokenId__assetType',
  TokenIdAuthorization = 'tokenId__authorization',
  TokenIdId = 'tokenId__id',
  TokenIdKya = 'tokenId__kya',
  TokenIdOpenTransferRequestsCount = 'tokenId__openTransferRequestsCount',
  TokenIdSupply = 'tokenId__supply',
  TokenIdTransferRequestsCount = 'tokenId__transferRequestsCount',
  Weight = 'weight'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<Meta>;
  dotcAsset?: Maybe<DotcAsset>;
  dotcAssets: Array<DotcAsset>;
  kyaData?: Maybe<KyaData>;
  kyaDatas: Array<KyaData>;
  redemption?: Maybe<Redemption>;
  redemptions: Array<Redemption>;
  sx1155Nft?: Maybe<Sx1155Nft>;
  sx1155Nftfactories: Array<Sx1155NftFactory>;
  sx1155Nftfactory?: Maybe<Sx1155NftFactory>;
  sx1155Nfts: Array<Sx1155Nft>;
  sx1155TokenId?: Maybe<Sx1155TokenId>;
  sx1155TokenIdTransfer?: Maybe<Sx1155TokenIdTransfer>;
  sx1155TokenIdTransfers: Array<Sx1155TokenIdTransfer>;
  sx1155TokenIds: Array<Sx1155TokenId>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  transferRequest?: Maybe<TransferRequest>;
  transferRequests: Array<TransferRequest>;
  user?: Maybe<User>;
  userHolding?: Maybe<UserHolding>;
  userHoldings: Array<UserHolding>;
  users: Array<User>;
  xOffer?: Maybe<XOffer>;
  xOffers: Array<XOffer>;
  xOrder?: Maybe<XOrder>;
  xOrders: Array<XOrder>;
};


export type QueryMetaArgs = {
  block?: InputMaybe<BlockHeight>;
};


export type QueryDotcAssetArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryDotcAssetsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DotcAssetOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<DotcAssetFilter>;
};


export type QueryKyaDataArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryKyaDatasArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<KyaDataOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<KyaDataFilter>;
};


export type QueryRedemptionArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryRedemptionsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RedemptionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<RedemptionFilter>;
};


export type QuerySx1155NftArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySx1155NftfactoriesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155NftFactoryOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<Sx1155NftFactoryFilter>;
};


export type QuerySx1155NftfactoryArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySx1155NftsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155NftOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<Sx1155NftFilter>;
};


export type QuerySx1155TokenIdArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySx1155TokenIdTransferArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySx1155TokenIdTransfersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155TokenIdTransferOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<Sx1155TokenIdTransferFilter>;
};


export type QuerySx1155TokenIdsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155TokenIdOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<Sx1155TokenIdFilter>;
};


export type QueryTransactionArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTransactionsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TransactionFilter>;
};


export type QueryTransferRequestArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTransferRequestsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransferRequestOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TransferRequestFilter>;
};


export type QueryUserArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryUserHoldingArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryUserHoldingsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserHoldingOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<UserHoldingFilter>;
};


export type QueryUsersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<UserFilter>;
};


export type QueryXOfferArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryXOffersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<XOfferOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<XOfferFilter>;
};


export type QueryXOrderArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryXOrdersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<XOrderOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<XOrderFilter>;
};

export type Redemption = {
  __typename?: 'Redemption';
  /** Id of NFT */
  id: Scalars['ID']['output'];
  /** The Address of NFT for Redemption */
  nft: Sx1155Nft;
  /** Address of a requester who started a redemption process */
  requester: Scalars['Bytes']['output'];
  /** Status of Redemption */
  status: RedemptionStatus;
  /** Id of NFT */
  tokenId: Sx1155TokenId;
};

export enum RedemptionStatus {
  Canceled = 'canceled',
  Complete = 'complete',
  InProgress = 'inProgress',
  NotSet = 'notSet'
}

export type RedemptionFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RedemptionFilter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nft?: InputMaybe<Scalars['String']['input']>;
  nft_?: InputMaybe<Sx1155NftFilter>;
  nft_contains?: InputMaybe<Scalars['String']['input']>;
  nft_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_ends_with?: InputMaybe<Scalars['String']['input']>;
  nft_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_gt?: InputMaybe<Scalars['String']['input']>;
  nft_gte?: InputMaybe<Scalars['String']['input']>;
  nft_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nft_lt?: InputMaybe<Scalars['String']['input']>;
  nft_lte?: InputMaybe<Scalars['String']['input']>;
  nft_not?: InputMaybe<Scalars['String']['input']>;
  nft_not_contains?: InputMaybe<Scalars['String']['input']>;
  nft_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  nft_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nft_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  nft_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_starts_with?: InputMaybe<Scalars['String']['input']>;
  nft_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<RedemptionFilter>>>;
  requester?: InputMaybe<Scalars['Bytes']['input']>;
  requester_contains?: InputMaybe<Scalars['Bytes']['input']>;
  requester_gt?: InputMaybe<Scalars['Bytes']['input']>;
  requester_gte?: InputMaybe<Scalars['Bytes']['input']>;
  requester_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  requester_lt?: InputMaybe<Scalars['Bytes']['input']>;
  requester_lte?: InputMaybe<Scalars['Bytes']['input']>;
  requester_not?: InputMaybe<Scalars['Bytes']['input']>;
  requester_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  requester_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  status?: InputMaybe<RedemptionStatus>;
  status_in?: InputMaybe<Array<RedemptionStatus>>;
  status_not?: InputMaybe<RedemptionStatus>;
  status_not_in?: InputMaybe<Array<RedemptionStatus>>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  tokenId_?: InputMaybe<Sx1155TokenIdFilter>;
  tokenId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  tokenId_not?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum RedemptionOrderBy {
  Id = 'id',
  Nft = 'nft',
  NftUri = 'nft__URI',
  NftActiveTokenIdsCount = 'nft__activeTokenIdsCount',
  NftAuthorization = 'nft__authorization',
  NftId = 'nft__id',
  NftKya = 'nft__kya',
  NftName = 'nft__name',
  NftPaused = 'nft__paused',
  NftSymbol = 'nft__symbol',
  NftTotalTokenIdsCount = 'nft__totalTokenIdsCount',
  Requester = 'requester',
  Status = 'status',
  TokenId = 'tokenId',
  TokenIdUri = 'tokenId__URI',
  TokenIdAssetType = 'tokenId__assetType',
  TokenIdAuthorization = 'tokenId__authorization',
  TokenIdId = 'tokenId__id',
  TokenIdKya = 'tokenId__kya',
  TokenIdOpenTransferRequestsCount = 'tokenId__openTransferRequestsCount',
  TokenIdSupply = 'tokenId__supply',
  TokenIdTransferRequestsCount = 'tokenId__transferRequestsCount'
}

export enum Sx1155AssetType {
  Gold = 'Gold',
  NotSet = 'notSet'
}

export type Sx1155Nft = {
  __typename?: 'SX1155NFT';
  /** Contract-level metadata URI */
  URI: Scalars['String']['output'];
  /** Total amount of Token IDs in circulation for current NFT */
  activeTokenIdsCount: Scalars['Int']['output'];
  /** List of addresses with DEFAULT_ADMIN_ROLE */
  admins: Array<Scalars['Bytes']['output']>;
  /** List of addresses with AGENT role */
  agents: Array<Scalars['Bytes']['output']>;
  /** Default authorization contract, used when not configured for each NFT */
  authorization: Scalars['Bytes']['output'];
  /** List of frozen accounts */
  blacklist: Array<Scalars['Bytes']['output']>;
  /** Deployment transaction info */
  deployedAt: Transaction;
  /** List of addresses with EDITOR role */
  editors: Array<Scalars['Bytes']['output']>;
  /** Factory that was used to deploy current SX1155NFT */
  factory: Sx1155NftFactory;
  /** List of greylisted accounts */
  greylist: Array<Scalars['Bytes']['output']>;
  /** The address of SX1155NFT */
  id: Scalars['ID']['output'];
  /** List of addresses with ISSUER role */
  issuers: Array<Scalars['Bytes']['output']>;
  /** Know Your Asset string */
  kya: Scalars['String']['output'];
  /** Name of the SX1155NFT */
  name: Scalars['String']['output'];
  /** True, if contract is paused */
  paused: Scalars['Boolean']['output'];
  /** All redemptions with current NFT */
  redemptions: Array<Redemption>;
  /** Symbol of the SX1155NFT */
  symbol: Scalars['String']['output'];
  tokenIds: Array<Sx1155TokenId>;
  /** Total amount of tokenIds minted for current NFT */
  totalTokenIdsCount: Scalars['Int']['output'];
  /** All transaction with current NFT */
  transactions: Array<Transaction>;
  /** List of whitelisted accounts */
  whitelist: Array<Scalars['Bytes']['output']>;
};


export type Sx1155NftRedemptionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RedemptionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RedemptionFilter>;
};


export type Sx1155NftTokenIdsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155TokenIdOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Sx1155TokenIdFilter>;
};


export type Sx1155NftTransactionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TransactionFilter>;
};

export type Sx1155NftFactory = {
  __typename?: 'SX1155NFTFactory';
  /** The address of SX1155NFTFactory contract */
  id: Scalars['ID']['output'];
  /** Number of SX1155NFTs that were deployed by this factory */
  nftsCount: Scalars['Int']['output'];
  /** All SX1155NFTs deployed with this factory */
  sx1155Nfts?: Maybe<Array<Sx1155Nft>>;
};


export type Sx1155NftFactorySx1155NftsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155NftOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Sx1155NftFilter>;
};

export type Sx1155NftFactoryFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Sx1155NftFactoryFilter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nftsCount?: InputMaybe<Scalars['Int']['input']>;
  nftsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  nftsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  nftsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nftsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  nftsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  nftsCount_not?: InputMaybe<Scalars['Int']['input']>;
  nftsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Sx1155NftFactoryFilter>>>;
  sx1155Nfts_?: InputMaybe<Sx1155NftFilter>;
};

export enum Sx1155NftFactoryOrderBy {
  Id = 'id',
  NftsCount = 'nftsCount',
  Sx1155Nfts = 'sx1155Nfts'
}

export type Sx1155NftFilter = {
  URI?: InputMaybe<Scalars['String']['input']>;
  URI_contains?: InputMaybe<Scalars['String']['input']>;
  URI_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_ends_with?: InputMaybe<Scalars['String']['input']>;
  URI_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_gt?: InputMaybe<Scalars['String']['input']>;
  URI_gte?: InputMaybe<Scalars['String']['input']>;
  URI_in?: InputMaybe<Array<Scalars['String']['input']>>;
  URI_lt?: InputMaybe<Scalars['String']['input']>;
  URI_lte?: InputMaybe<Scalars['String']['input']>;
  URI_not?: InputMaybe<Scalars['String']['input']>;
  URI_not_contains?: InputMaybe<Scalars['String']['input']>;
  URI_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  URI_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  URI_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  URI_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_starts_with?: InputMaybe<Scalars['String']['input']>;
  URI_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeTokenIdsCount?: InputMaybe<Scalars['Int']['input']>;
  activeTokenIdsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  activeTokenIdsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  activeTokenIdsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  activeTokenIdsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  activeTokenIdsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  activeTokenIdsCount_not?: InputMaybe<Scalars['Int']['input']>;
  activeTokenIdsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  admins?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  admins_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  admins_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  admins_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  admins_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  admins_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  agents?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  agents_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  agents_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  agents_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  agents_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  agents_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Sx1155NftFilter>>>;
  authorization?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_contains?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_gt?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_gte?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  authorization_lt?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_lte?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_not?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  blacklist?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  blacklist_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  blacklist_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  blacklist_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  blacklist_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  blacklist_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  deployedAt?: InputMaybe<Scalars['String']['input']>;
  deployedAt_?: InputMaybe<TransactionFilter>;
  deployedAt_contains?: InputMaybe<Scalars['String']['input']>;
  deployedAt_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  deployedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  deployedAt_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deployedAt_gt?: InputMaybe<Scalars['String']['input']>;
  deployedAt_gte?: InputMaybe<Scalars['String']['input']>;
  deployedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  deployedAt_lt?: InputMaybe<Scalars['String']['input']>;
  deployedAt_lte?: InputMaybe<Scalars['String']['input']>;
  deployedAt_not?: InputMaybe<Scalars['String']['input']>;
  deployedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  deployedAt_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  deployedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  deployedAt_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deployedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  deployedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  deployedAt_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deployedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  deployedAt_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  editors?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  editors_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  editors_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  editors_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  editors_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  editors_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<Sx1155NftFactoryFilter>;
  factory_contains?: InputMaybe<Scalars['String']['input']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_gt?: InputMaybe<Scalars['String']['input']>;
  factory_gte?: InputMaybe<Scalars['String']['input']>;
  factory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_lt?: InputMaybe<Scalars['String']['input']>;
  factory_lte?: InputMaybe<Scalars['String']['input']>;
  factory_not?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  greylist?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  greylist_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  greylist_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  greylist_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  greylist_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  greylist_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  issuers?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  issuers_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  issuers_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  issuers_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  issuers_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  issuers_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  kya?: InputMaybe<Scalars['String']['input']>;
  kya_contains?: InputMaybe<Scalars['String']['input']>;
  kya_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_ends_with?: InputMaybe<Scalars['String']['input']>;
  kya_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_gt?: InputMaybe<Scalars['String']['input']>;
  kya_gte?: InputMaybe<Scalars['String']['input']>;
  kya_in?: InputMaybe<Array<Scalars['String']['input']>>;
  kya_lt?: InputMaybe<Scalars['String']['input']>;
  kya_lte?: InputMaybe<Scalars['String']['input']>;
  kya_not?: InputMaybe<Scalars['String']['input']>;
  kya_not_contains?: InputMaybe<Scalars['String']['input']>;
  kya_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  kya_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  kya_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  kya_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_starts_with?: InputMaybe<Scalars['String']['input']>;
  kya_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Sx1155NftFilter>>>;
  paused?: InputMaybe<Scalars['Boolean']['input']>;
  paused_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  paused_not?: InputMaybe<Scalars['Boolean']['input']>;
  paused_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  redemptions_?: InputMaybe<RedemptionFilter>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIds_?: InputMaybe<Sx1155TokenIdFilter>;
  totalTokenIdsCount?: InputMaybe<Scalars['Int']['input']>;
  totalTokenIdsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  totalTokenIdsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  totalTokenIdsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalTokenIdsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  totalTokenIdsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  totalTokenIdsCount_not?: InputMaybe<Scalars['Int']['input']>;
  totalTokenIdsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  transactions_?: InputMaybe<TransactionFilter>;
  whitelist?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelist_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelist_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelist_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelist_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  whitelist_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Sx1155NftOrderBy {
  Uri = 'URI',
  ActiveTokenIdsCount = 'activeTokenIdsCount',
  Admins = 'admins',
  Agents = 'agents',
  Authorization = 'authorization',
  Blacklist = 'blacklist',
  DeployedAt = 'deployedAt',
  DeployedAtBlock = 'deployedAt__block',
  DeployedAtGasPrice = 'deployedAt__gasPrice',
  DeployedAtGasUsed = 'deployedAt__gasUsed',
  DeployedAtId = 'deployedAt__id',
  DeployedAtTimestamp = 'deployedAt__timestamp',
  DeployedAtType = 'deployedAt__type',
  Editors = 'editors',
  Factory = 'factory',
  FactoryId = 'factory__id',
  FactoryNftsCount = 'factory__nftsCount',
  Greylist = 'greylist',
  Id = 'id',
  Issuers = 'issuers',
  Kya = 'kya',
  Name = 'name',
  Paused = 'paused',
  Redemptions = 'redemptions',
  Symbol = 'symbol',
  TokenIds = 'tokenIds',
  TotalTokenIdsCount = 'totalTokenIdsCount',
  Transactions = 'transactions',
  Whitelist = 'whitelist'
}

export type Sx1155TokenId = {
  __typename?: 'SX1155TokenId';
  /** TokenID-level URI */
  URI: Scalars['String']['output'];
  assetType?: Maybe<Sx1155AssetType>;
  /** Authorization contract */
  authorization?: Maybe<Scalars['Bytes']['output']>;
  holdings: Array<UserHolding>;
  id: Scalars['ID']['output'];
  /** Know Your Asset entity for RWAs */
  kya: Scalars['String']['output'];
  kyaData?: Maybe<KyaData>;
  /** Mint transaction info */
  mintedAt: Transaction;
  /** Total amount of opened transfer requests */
  openTransferRequestsCount: Scalars['Int']['output'];
  /** Parent NFT */
  parentNFT: Sx1155Nft;
  redemption: Redemption;
  /** Total supply of this tokenId */
  supply: Scalars['BigInt']['output'];
  /** Transfer request to be confirmed by issuer */
  transferRequests: Array<TransferRequest>;
  /** Total amount of transfer requests */
  transferRequestsCount: Scalars['Int']['output'];
  transfers: Array<Sx1155TokenIdTransfer>;
};


export type Sx1155TokenIdHoldingsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserHoldingOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserHoldingFilter>;
};


export type Sx1155TokenIdTransferRequestsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransferRequestOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TransferRequestFilter>;
};


export type Sx1155TokenIdTransfersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155TokenIdTransferOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Sx1155TokenIdTransferFilter>;
};

export type Sx1155TokenIdTransfer = {
  __typename?: 'SX1155TokenIdTransfer';
  amount: Scalars['BigInt']['output'];
  from: User;
  id: Scalars['ID']['output'];
  to: User;
  tokenId: Sx1155TokenId;
  transaction: Transaction;
};

export type Sx1155TokenIdTransferFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Sx1155TokenIdTransferFilter>>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_?: InputMaybe<UserFilter>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Sx1155TokenIdTransferFilter>>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_?: InputMaybe<UserFilter>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  tokenId_?: InputMaybe<Sx1155TokenIdFilter>;
  tokenId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  tokenId_not?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<TransactionFilter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Sx1155TokenIdTransferOrderBy {
  Amount = 'amount',
  From = 'from',
  FromId = 'from__id',
  Id = 'id',
  To = 'to',
  ToId = 'to__id',
  TokenId = 'tokenId',
  TokenIdUri = 'tokenId__URI',
  TokenIdAssetType = 'tokenId__assetType',
  TokenIdAuthorization = 'tokenId__authorization',
  TokenIdId = 'tokenId__id',
  TokenIdKya = 'tokenId__kya',
  TokenIdOpenTransferRequestsCount = 'tokenId__openTransferRequestsCount',
  TokenIdSupply = 'tokenId__supply',
  TokenIdTransferRequestsCount = 'tokenId__transferRequestsCount',
  Transaction = 'transaction',
  TransactionBlock = 'transaction__block',
  TransactionGasPrice = 'transaction__gasPrice',
  TransactionGasUsed = 'transaction__gasUsed',
  TransactionId = 'transaction__id',
  TransactionTimestamp = 'transaction__timestamp',
  TransactionType = 'transaction__type'
}

export type Sx1155TokenIdFilter = {
  URI?: InputMaybe<Scalars['String']['input']>;
  URI_contains?: InputMaybe<Scalars['String']['input']>;
  URI_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_ends_with?: InputMaybe<Scalars['String']['input']>;
  URI_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_gt?: InputMaybe<Scalars['String']['input']>;
  URI_gte?: InputMaybe<Scalars['String']['input']>;
  URI_in?: InputMaybe<Array<Scalars['String']['input']>>;
  URI_lt?: InputMaybe<Scalars['String']['input']>;
  URI_lte?: InputMaybe<Scalars['String']['input']>;
  URI_not?: InputMaybe<Scalars['String']['input']>;
  URI_not_contains?: InputMaybe<Scalars['String']['input']>;
  URI_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  URI_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  URI_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  URI_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  URI_starts_with?: InputMaybe<Scalars['String']['input']>;
  URI_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Sx1155TokenIdFilter>>>;
  assetType?: InputMaybe<Sx1155AssetType>;
  assetType_in?: InputMaybe<Array<Sx1155AssetType>>;
  assetType_not?: InputMaybe<Sx1155AssetType>;
  assetType_not_in?: InputMaybe<Array<Sx1155AssetType>>;
  authorization?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_contains?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_gt?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_gte?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  authorization_lt?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_lte?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_not?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  authorization_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  holdings_?: InputMaybe<UserHoldingFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  kya?: InputMaybe<Scalars['String']['input']>;
  kyaData?: InputMaybe<Scalars['String']['input']>;
  kyaData_?: InputMaybe<KyaDataFilter>;
  kyaData_contains?: InputMaybe<Scalars['String']['input']>;
  kyaData_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  kyaData_ends_with?: InputMaybe<Scalars['String']['input']>;
  kyaData_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kyaData_gt?: InputMaybe<Scalars['String']['input']>;
  kyaData_gte?: InputMaybe<Scalars['String']['input']>;
  kyaData_in?: InputMaybe<Array<Scalars['String']['input']>>;
  kyaData_lt?: InputMaybe<Scalars['String']['input']>;
  kyaData_lte?: InputMaybe<Scalars['String']['input']>;
  kyaData_not?: InputMaybe<Scalars['String']['input']>;
  kyaData_not_contains?: InputMaybe<Scalars['String']['input']>;
  kyaData_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  kyaData_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  kyaData_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kyaData_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  kyaData_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  kyaData_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kyaData_starts_with?: InputMaybe<Scalars['String']['input']>;
  kyaData_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_contains?: InputMaybe<Scalars['String']['input']>;
  kya_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_ends_with?: InputMaybe<Scalars['String']['input']>;
  kya_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_gt?: InputMaybe<Scalars['String']['input']>;
  kya_gte?: InputMaybe<Scalars['String']['input']>;
  kya_in?: InputMaybe<Array<Scalars['String']['input']>>;
  kya_lt?: InputMaybe<Scalars['String']['input']>;
  kya_lte?: InputMaybe<Scalars['String']['input']>;
  kya_not?: InputMaybe<Scalars['String']['input']>;
  kya_not_contains?: InputMaybe<Scalars['String']['input']>;
  kya_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  kya_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  kya_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  kya_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  kya_starts_with?: InputMaybe<Scalars['String']['input']>;
  kya_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mintedAt?: InputMaybe<Scalars['String']['input']>;
  mintedAt_?: InputMaybe<TransactionFilter>;
  mintedAt_contains?: InputMaybe<Scalars['String']['input']>;
  mintedAt_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  mintedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  mintedAt_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mintedAt_gt?: InputMaybe<Scalars['String']['input']>;
  mintedAt_gte?: InputMaybe<Scalars['String']['input']>;
  mintedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mintedAt_lt?: InputMaybe<Scalars['String']['input']>;
  mintedAt_lte?: InputMaybe<Scalars['String']['input']>;
  mintedAt_not?: InputMaybe<Scalars['String']['input']>;
  mintedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  mintedAt_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  mintedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  mintedAt_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mintedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  mintedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  mintedAt_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  mintedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  mintedAt_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  openTransferRequestsCount?: InputMaybe<Scalars['Int']['input']>;
  openTransferRequestsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  openTransferRequestsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  openTransferRequestsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  openTransferRequestsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  openTransferRequestsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  openTransferRequestsCount_not?: InputMaybe<Scalars['Int']['input']>;
  openTransferRequestsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Sx1155TokenIdFilter>>>;
  parentNFT?: InputMaybe<Scalars['String']['input']>;
  parentNFT_?: InputMaybe<Sx1155NftFilter>;
  parentNFT_contains?: InputMaybe<Scalars['String']['input']>;
  parentNFT_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentNFT_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentNFT_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentNFT_gt?: InputMaybe<Scalars['String']['input']>;
  parentNFT_gte?: InputMaybe<Scalars['String']['input']>;
  parentNFT_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentNFT_lt?: InputMaybe<Scalars['String']['input']>;
  parentNFT_lte?: InputMaybe<Scalars['String']['input']>;
  parentNFT_not?: InputMaybe<Scalars['String']['input']>;
  parentNFT_not_contains?: InputMaybe<Scalars['String']['input']>;
  parentNFT_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentNFT_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentNFT_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentNFT_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentNFT_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentNFT_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentNFT_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentNFT_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  redemption_?: InputMaybe<RedemptionFilter>;
  supply?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  supply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  supply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not?: InputMaybe<Scalars['BigInt']['input']>;
  supply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferRequestsCount?: InputMaybe<Scalars['Int']['input']>;
  transferRequestsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  transferRequestsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  transferRequestsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  transferRequestsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  transferRequestsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  transferRequestsCount_not?: InputMaybe<Scalars['Int']['input']>;
  transferRequestsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  transferRequests_?: InputMaybe<TransferRequestFilter>;
  transfers_?: InputMaybe<Sx1155TokenIdTransferFilter>;
};

export enum Sx1155TokenIdOrderBy {
  Uri = 'URI',
  AssetType = 'assetType',
  Authorization = 'authorization',
  Holdings = 'holdings',
  Id = 'id',
  Kya = 'kya',
  KyaData = 'kyaData',
  KyaDataAssetTicker = 'kyaData__assetTicker',
  KyaDataAssetType = 'kyaData__assetType',
  KyaDataBlockchain = 'kyaData__blockchain',
  KyaDataCustodian = 'kyaData__custodian',
  KyaDataDescription = 'kyaData__description',
  KyaDataEditionNumber = 'kyaData__editionNumber',
  KyaDataExternalUrl = 'kyaData__externalURL',
  KyaDataId = 'kyaData__id',
  KyaDataImageUrl = 'kyaData__imageURL',
  KyaDataIssuer = 'kyaData__issuer',
  KyaDataLocation = 'kyaData__location',
  KyaDataName = 'kyaData__name',
  KyaDataPurity = 'kyaData__purity',
  KyaDataSerialNumber = 'kyaData__serialNumber',
  KyaDataSymbol = 'kyaData__symbol',
  KyaDataWeight = 'kyaData__weight',
  MintedAt = 'mintedAt',
  MintedAtBlock = 'mintedAt__block',
  MintedAtGasPrice = 'mintedAt__gasPrice',
  MintedAtGasUsed = 'mintedAt__gasUsed',
  MintedAtId = 'mintedAt__id',
  MintedAtTimestamp = 'mintedAt__timestamp',
  MintedAtType = 'mintedAt__type',
  OpenTransferRequestsCount = 'openTransferRequestsCount',
  ParentNft = 'parentNFT',
  ParentNftUri = 'parentNFT__URI',
  ParentNftActiveTokenIdsCount = 'parentNFT__activeTokenIdsCount',
  ParentNftAuthorization = 'parentNFT__authorization',
  ParentNftId = 'parentNFT__id',
  ParentNftKya = 'parentNFT__kya',
  ParentNftName = 'parentNFT__name',
  ParentNftPaused = 'parentNFT__paused',
  ParentNftSymbol = 'parentNFT__symbol',
  ParentNftTotalTokenIdsCount = 'parentNFT__totalTokenIdsCount',
  Redemption = 'redemption',
  RedemptionId = 'redemption__id',
  RedemptionRequester = 'redemption__requester',
  RedemptionStatus = 'redemption__status',
  Supply = 'supply',
  TransferRequests = 'transferRequests',
  TransferRequestsCount = 'transferRequestsCount',
  Transfers = 'transfers'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<Meta>;
  dotcAsset?: Maybe<DotcAsset>;
  dotcAssets: Array<DotcAsset>;
  kyaData?: Maybe<KyaData>;
  kyaDatas: Array<KyaData>;
  redemption?: Maybe<Redemption>;
  redemptions: Array<Redemption>;
  sx1155Nft?: Maybe<Sx1155Nft>;
  sx1155Nftfactories: Array<Sx1155NftFactory>;
  sx1155Nftfactory?: Maybe<Sx1155NftFactory>;
  sx1155Nfts: Array<Sx1155Nft>;
  sx1155TokenId?: Maybe<Sx1155TokenId>;
  sx1155TokenIdTransfer?: Maybe<Sx1155TokenIdTransfer>;
  sx1155TokenIdTransfers: Array<Sx1155TokenIdTransfer>;
  sx1155TokenIds: Array<Sx1155TokenId>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  transferRequest?: Maybe<TransferRequest>;
  transferRequests: Array<TransferRequest>;
  user?: Maybe<User>;
  userHolding?: Maybe<UserHolding>;
  userHoldings: Array<UserHolding>;
  users: Array<User>;
  xOffer?: Maybe<XOffer>;
  xOffers: Array<XOffer>;
  xOrder?: Maybe<XOrder>;
  xOrders: Array<XOrder>;
};


export type SubscriptionMetaArgs = {
  block?: InputMaybe<BlockHeight>;
};


export type SubscriptionDotcAssetArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionDotcAssetsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DotcAssetOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<DotcAssetFilter>;
};


export type SubscriptionKyaDataArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionKyaDatasArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<KyaDataOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<KyaDataFilter>;
};


export type SubscriptionRedemptionArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionRedemptionsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RedemptionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<RedemptionFilter>;
};


export type SubscriptionSx1155NftArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionSx1155NftfactoriesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155NftFactoryOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<Sx1155NftFactoryFilter>;
};


export type SubscriptionSx1155NftfactoryArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionSx1155NftsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155NftOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<Sx1155NftFilter>;
};


export type SubscriptionSx1155TokenIdArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionSx1155TokenIdTransferArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionSx1155TokenIdTransfersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155TokenIdTransferOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<Sx1155TokenIdTransferFilter>;
};


export type SubscriptionSx1155TokenIdsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Sx1155TokenIdOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<Sx1155TokenIdFilter>;
};


export type SubscriptionTransactionArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TransactionFilter>;
};


export type SubscriptionTransferRequestArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionTransferRequestsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransferRequestOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TransferRequestFilter>;
};


export type SubscriptionUserArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionUserHoldingArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionUserHoldingsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserHoldingOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<UserHoldingFilter>;
};


export type SubscriptionUsersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<UserFilter>;
};


export type SubscriptionXOfferArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionXOffersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<XOfferOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<XOfferFilter>;
};


export type SubscriptionXOrderArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type SubscriptionXOrdersArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<XOrderOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<XOrderFilter>;
};

export type Transaction = {
  __typename?: 'Transaction';
  /** Block number */
  block: Scalars['Int']['output'];
  /** Address of transaction signer */
  caller: User;
  /** Gas price when this transaction was created */
  gasPrice: Scalars['BigDecimal']['output'];
  /** Amount of gas used for this transaction */
  gasUsed: Scalars['BigDecimal']['output'];
  /** Transaction hash */
  id: Scalars['ID']['output'];
  /** Involved NFT */
  nft: Sx1155Nft;
  /** Timestamp of transaction */
  timestamp: Scalars['Int']['output'];
  /** Type of transaction */
  type: TransactionType;
};

export enum TransactionType {
  AddBatchToBlacklist = 'addBatchToBlacklist',
  AddBatchToGreylist = 'addBatchToGreylist',
  AddBatchToWhitelist = 'addBatchToWhitelist',
  AddToBlacklist = 'addToBlacklist',
  AddToGreylist = 'addToGreylist',
  AddToWhitelist = 'addToWhitelist',
  BurnBatch = 'burnBatch',
  BurnSingle = 'burnSingle',
  Creation = 'creation',
  ForceBurnBatch = 'forceBurnBatch',
  ForceBurnSingle = 'forceBurnSingle',
  ForceTransferBatch = 'forceTransferBatch',
  ForceTransferSingle = 'forceTransferSingle',
  MintBatch = 'mintBatch',
  MintSingle = 'mintSingle',
  NotSet = 'notSet',
  Pause = 'pause',
  RemoveBatchFromBlacklist = 'removeBatchFromBlacklist',
  RemoveBatchFromGreylist = 'removeBatchFromGreylist',
  RemoveBatchFromWhitelist = 'removeBatchFromWhitelist',
  RemoveFromBlacklist = 'removeFromBlacklist',
  RemoveFromGreylist = 'removeFromGreylist',
  RemoveFromWhitelist = 'removeFromWhitelist',
  SetContractUri = 'setContractUri',
  TransferBatch = 'transferBatch',
  TransferRequestApproved = 'transferRequestApproved',
  TransferRequestCancelled = 'transferRequestCancelled',
  TransferRequestCreated = 'transferRequestCreated',
  TransferSingle = 'transferSingle',
  Unpause = 'unpause',
  UpdateGlobalAuth = 'updateGlobalAuth',
  UpdateGlobalKya = 'updateGlobalKYA',
  UpdateTokenIdAuth = 'updateTokenIdAuth',
  UpdateTokenIdKya = 'updateTokenIdKYA'
}

export type TransactionFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TransactionFilter>>>;
  block?: InputMaybe<Scalars['Int']['input']>;
  block_gt?: InputMaybe<Scalars['Int']['input']>;
  block_gte?: InputMaybe<Scalars['Int']['input']>;
  block_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  block_lt?: InputMaybe<Scalars['Int']['input']>;
  block_lte?: InputMaybe<Scalars['Int']['input']>;
  block_not?: InputMaybe<Scalars['Int']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  caller?: InputMaybe<Scalars['String']['input']>;
  caller_?: InputMaybe<UserFilter>;
  caller_contains?: InputMaybe<Scalars['String']['input']>;
  caller_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_ends_with?: InputMaybe<Scalars['String']['input']>;
  caller_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_gt?: InputMaybe<Scalars['String']['input']>;
  caller_gte?: InputMaybe<Scalars['String']['input']>;
  caller_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_lt?: InputMaybe<Scalars['String']['input']>;
  caller_lte?: InputMaybe<Scalars['String']['input']>;
  caller_not?: InputMaybe<Scalars['String']['input']>;
  caller_not_contains?: InputMaybe<Scalars['String']['input']>;
  caller_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  caller_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  caller_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  caller_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  caller_starts_with?: InputMaybe<Scalars['String']['input']>;
  caller_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gasPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  gasPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  gasUsed?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasUsed_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasUsed_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasUsed_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  gasUsed_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasUsed_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasUsed_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  gasUsed_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nft?: InputMaybe<Scalars['String']['input']>;
  nft_?: InputMaybe<Sx1155NftFilter>;
  nft_contains?: InputMaybe<Scalars['String']['input']>;
  nft_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_ends_with?: InputMaybe<Scalars['String']['input']>;
  nft_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_gt?: InputMaybe<Scalars['String']['input']>;
  nft_gte?: InputMaybe<Scalars['String']['input']>;
  nft_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nft_lt?: InputMaybe<Scalars['String']['input']>;
  nft_lte?: InputMaybe<Scalars['String']['input']>;
  nft_not?: InputMaybe<Scalars['String']['input']>;
  nft_not_contains?: InputMaybe<Scalars['String']['input']>;
  nft_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  nft_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nft_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  nft_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  nft_starts_with?: InputMaybe<Scalars['String']['input']>;
  nft_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<TransactionFilter>>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  type?: InputMaybe<TransactionType>;
  type_in?: InputMaybe<Array<TransactionType>>;
  type_not?: InputMaybe<TransactionType>;
  type_not_in?: InputMaybe<Array<TransactionType>>;
};

export enum TransactionOrderBy {
  Block = 'block',
  Caller = 'caller',
  CallerId = 'caller__id',
  GasPrice = 'gasPrice',
  GasUsed = 'gasUsed',
  Id = 'id',
  Nft = 'nft',
  NftUri = 'nft__URI',
  NftActiveTokenIdsCount = 'nft__activeTokenIdsCount',
  NftAuthorization = 'nft__authorization',
  NftId = 'nft__id',
  NftKya = 'nft__kya',
  NftName = 'nft__name',
  NftPaused = 'nft__paused',
  NftSymbol = 'nft__symbol',
  NftTotalTokenIdsCount = 'nft__totalTokenIdsCount',
  Timestamp = 'timestamp',
  Type = 'type'
}

export type TransferRequest = {
  __typename?: 'TransferRequest';
  /** Transaction, when transfer request was created */
  createdAt: Transaction;
  /** Sender */
  from: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  /** CreatedAt / approvedAt / cancelAt  transaction */
  lastUpdatedAt: Transaction;
  /** Quantity number of tokens to transfer */
  quantity: Scalars['BigInt']['output'];
  status: TransferRequestStatus;
  /** Receiver */
  to: Scalars['Bytes']['output'];
  /** SX1155TokenId to transfer */
  tokenId: Sx1155TokenId;
};

export enum TransferRequestStatus {
  Approved = 'approved',
  Cancelled = 'cancelled',
  Pending = 'pending'
}

export type TransferRequestFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TransferRequestFilter>>>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  createdAt_?: InputMaybe<TransactionFilter>;
  createdAt_contains?: InputMaybe<Scalars['String']['input']>;
  createdAt_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  createdAt_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt_gt?: InputMaybe<Scalars['String']['input']>;
  createdAt_gte?: InputMaybe<Scalars['String']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['String']['input']>;
  createdAt_lte?: InputMaybe<Scalars['String']['input']>;
  createdAt_not?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  createdAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  createdAt_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Bytes']['input']>;
  from_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_gt?: InputMaybe<Scalars['Bytes']['input']>;
  from_gte?: InputMaybe<Scalars['Bytes']['input']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  from_lt?: InputMaybe<Scalars['Bytes']['input']>;
  from_lte?: InputMaybe<Scalars['Bytes']['input']>;
  from_not?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastUpdatedAt?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_?: InputMaybe<TransactionFilter>;
  lastUpdatedAt_contains?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_ends_with?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_gt?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_gte?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lastUpdatedAt_lt?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_lte?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_not?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lastUpdatedAt_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_starts_with?: InputMaybe<Scalars['String']['input']>;
  lastUpdatedAt_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<TransferRequestFilter>>>;
  quantity?: InputMaybe<Scalars['BigInt']['input']>;
  quantity_gt?: InputMaybe<Scalars['BigInt']['input']>;
  quantity_gte?: InputMaybe<Scalars['BigInt']['input']>;
  quantity_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quantity_lt?: InputMaybe<Scalars['BigInt']['input']>;
  quantity_lte?: InputMaybe<Scalars['BigInt']['input']>;
  quantity_not?: InputMaybe<Scalars['BigInt']['input']>;
  quantity_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  status?: InputMaybe<TransferRequestStatus>;
  status_in?: InputMaybe<Array<TransferRequestStatus>>;
  status_not?: InputMaybe<TransferRequestStatus>;
  status_not_in?: InputMaybe<Array<TransferRequestStatus>>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_gt?: InputMaybe<Scalars['Bytes']['input']>;
  to_gte?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_lt?: InputMaybe<Scalars['Bytes']['input']>;
  to_lte?: InputMaybe<Scalars['Bytes']['input']>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  tokenId_?: InputMaybe<Sx1155TokenIdFilter>;
  tokenId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  tokenId_not?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum TransferRequestOrderBy {
  CreatedAt = 'createdAt',
  CreatedAtBlock = 'createdAt__block',
  CreatedAtGasPrice = 'createdAt__gasPrice',
  CreatedAtGasUsed = 'createdAt__gasUsed',
  CreatedAtId = 'createdAt__id',
  CreatedAtTimestamp = 'createdAt__timestamp',
  CreatedAtType = 'createdAt__type',
  From = 'from',
  Id = 'id',
  LastUpdatedAt = 'lastUpdatedAt',
  LastUpdatedAtBlock = 'lastUpdatedAt__block',
  LastUpdatedAtGasPrice = 'lastUpdatedAt__gasPrice',
  LastUpdatedAtGasUsed = 'lastUpdatedAt__gasUsed',
  LastUpdatedAtId = 'lastUpdatedAt__id',
  LastUpdatedAtTimestamp = 'lastUpdatedAt__timestamp',
  LastUpdatedAtType = 'lastUpdatedAt__type',
  Quantity = 'quantity',
  Status = 'status',
  To = 'to',
  TokenId = 'tokenId',
  TokenIdUri = 'tokenId__URI',
  TokenIdAssetType = 'tokenId__assetType',
  TokenIdAuthorization = 'tokenId__authorization',
  TokenIdId = 'tokenId__id',
  TokenIdKya = 'tokenId__kya',
  TokenIdOpenTransferRequestsCount = 'tokenId__openTransferRequestsCount',
  TokenIdSupply = 'tokenId__supply',
  TokenIdTransferRequestsCount = 'tokenId__transferRequestsCount'
}

export type User = {
  __typename?: 'User';
  holdings: Array<UserHolding>;
  /** User address */
  id: Scalars['ID']['output'];
  transactions?: Maybe<Array<Transaction>>;
};


export type UserHoldingsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserHoldingOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserHoldingFilter>;
};


export type UserTransactionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransactionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TransactionFilter>;
};

export type UserHolding = {
  __typename?: 'UserHolding';
  balance: Scalars['BigInt']['output'];
  /** concatenated User address with nft address and tokenId */
  id: Scalars['ID']['output'];
  tokenId: Sx1155TokenId;
  user: User;
};

export type UserHoldingFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UserHoldingFilter>>>;
  balance?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  balance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not?: InputMaybe<Scalars['BigInt']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UserHoldingFilter>>>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  tokenId_?: InputMaybe<Sx1155TokenIdFilter>;
  tokenId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_gt?: InputMaybe<Scalars['String']['input']>;
  tokenId_gte?: InputMaybe<Scalars['String']['input']>;
  tokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_lt?: InputMaybe<Scalars['String']['input']>;
  tokenId_lte?: InputMaybe<Scalars['String']['input']>;
  tokenId_not?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_?: InputMaybe<UserFilter>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum UserHoldingOrderBy {
  Balance = 'balance',
  Id = 'id',
  TokenId = 'tokenId',
  TokenIdUri = 'tokenId__URI',
  TokenIdAssetType = 'tokenId__assetType',
  TokenIdAuthorization = 'tokenId__authorization',
  TokenIdId = 'tokenId__id',
  TokenIdKya = 'tokenId__kya',
  TokenIdOpenTransferRequestsCount = 'tokenId__openTransferRequestsCount',
  TokenIdSupply = 'tokenId__supply',
  TokenIdTransferRequestsCount = 'tokenId__transferRequestsCount',
  User = 'user',
  UserId = 'user__id'
}

export type UserFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UserFilter>>>;
  holdings_?: InputMaybe<UserHoldingFilter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UserFilter>>>;
  transactions_?: InputMaybe<TransactionFilter>;
};

export enum UserOrderBy {
  Holdings = 'holdings',
  Id = 'id',
  Transactions = 'transactions'
}

export type Block = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type Meta = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: Block;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum SubgraphErrorPolicy {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type XOffer = {
  __typename?: 'xOffer';
  amountIn: Scalars['BigDecimal']['output'];
  amountOut: Scalars['BigDecimal']['output'];
  availableAmount: Scalars['BigDecimal']['output'];
  cancelled: Scalars['Boolean']['output'];
  cancelledAt: Scalars['BigInt']['output'];
  commsLink: Scalars['String']['output'];
  createdAt: Scalars['BigInt']['output'];
  depositAsset: DotcAsset;
  expiresAt: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  isFullType: Scalars['Boolean']['output'];
  isPrivate: Scalars['Boolean']['output'];
  maker: Scalars['Bytes']['output'];
  price: Scalars['BigDecimal']['output'];
  specialAddresses: Array<Scalars['Bytes']['output']>;
  terms: Scalars['String']['output'];
  timelockPeriod: Scalars['BigInt']['output'];
  withdrawalAsset: DotcAsset;
  xOrders: Array<XOrder>;
};


export type XOfferXOrdersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<XOrderOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<XOrderFilter>;
};

export type XOfferFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountIn?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountIn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountOut?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<XOfferFilter>>>;
  availableAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  availableAmount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  availableAmount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  availableAmount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  availableAmount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  availableAmount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  availableAmount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  availableAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cancelled?: InputMaybe<Scalars['Boolean']['input']>;
  cancelledAt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelledAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  cancelledAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cancelled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  cancelled_not?: InputMaybe<Scalars['Boolean']['input']>;
  cancelled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  commsLink?: InputMaybe<Scalars['String']['input']>;
  commsLink_contains?: InputMaybe<Scalars['String']['input']>;
  commsLink_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  commsLink_ends_with?: InputMaybe<Scalars['String']['input']>;
  commsLink_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  commsLink_gt?: InputMaybe<Scalars['String']['input']>;
  commsLink_gte?: InputMaybe<Scalars['String']['input']>;
  commsLink_in?: InputMaybe<Array<Scalars['String']['input']>>;
  commsLink_lt?: InputMaybe<Scalars['String']['input']>;
  commsLink_lte?: InputMaybe<Scalars['String']['input']>;
  commsLink_not?: InputMaybe<Scalars['String']['input']>;
  commsLink_not_contains?: InputMaybe<Scalars['String']['input']>;
  commsLink_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  commsLink_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  commsLink_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  commsLink_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  commsLink_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  commsLink_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  commsLink_starts_with?: InputMaybe<Scalars['String']['input']>;
  commsLink_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositAsset?: InputMaybe<Scalars['String']['input']>;
  depositAsset_?: InputMaybe<DotcAssetFilter>;
  depositAsset_contains?: InputMaybe<Scalars['String']['input']>;
  depositAsset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  depositAsset_ends_with?: InputMaybe<Scalars['String']['input']>;
  depositAsset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  depositAsset_gt?: InputMaybe<Scalars['String']['input']>;
  depositAsset_gte?: InputMaybe<Scalars['String']['input']>;
  depositAsset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  depositAsset_lt?: InputMaybe<Scalars['String']['input']>;
  depositAsset_lte?: InputMaybe<Scalars['String']['input']>;
  depositAsset_not?: InputMaybe<Scalars['String']['input']>;
  depositAsset_not_contains?: InputMaybe<Scalars['String']['input']>;
  depositAsset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  depositAsset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  depositAsset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  depositAsset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  depositAsset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  depositAsset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  depositAsset_starts_with?: InputMaybe<Scalars['String']['input']>;
  depositAsset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiresAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiresAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  isCompleted_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isCompleted_not?: InputMaybe<Scalars['Boolean']['input']>;
  isCompleted_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isFullType?: InputMaybe<Scalars['Boolean']['input']>;
  isFullType_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isFullType_not?: InputMaybe<Scalars['Boolean']['input']>;
  isFullType_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  isPrivate_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isPrivate_not?: InputMaybe<Scalars['Boolean']['input']>;
  isPrivate_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  maker?: InputMaybe<Scalars['Bytes']['input']>;
  maker_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maker_gt?: InputMaybe<Scalars['Bytes']['input']>;
  maker_gte?: InputMaybe<Scalars['Bytes']['input']>;
  maker_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  maker_lt?: InputMaybe<Scalars['Bytes']['input']>;
  maker_lte?: InputMaybe<Scalars['Bytes']['input']>;
  maker_not?: InputMaybe<Scalars['Bytes']['input']>;
  maker_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  maker_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<XOfferFilter>>>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  specialAddresses?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  specialAddresses_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  specialAddresses_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  specialAddresses_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  specialAddresses_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  specialAddresses_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  terms?: InputMaybe<Scalars['String']['input']>;
  terms_contains?: InputMaybe<Scalars['String']['input']>;
  terms_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  terms_ends_with?: InputMaybe<Scalars['String']['input']>;
  terms_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  terms_gt?: InputMaybe<Scalars['String']['input']>;
  terms_gte?: InputMaybe<Scalars['String']['input']>;
  terms_in?: InputMaybe<Array<Scalars['String']['input']>>;
  terms_lt?: InputMaybe<Scalars['String']['input']>;
  terms_lte?: InputMaybe<Scalars['String']['input']>;
  terms_not?: InputMaybe<Scalars['String']['input']>;
  terms_not_contains?: InputMaybe<Scalars['String']['input']>;
  terms_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  terms_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  terms_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  terms_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  terms_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  terms_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  terms_starts_with?: InputMaybe<Scalars['String']['input']>;
  terms_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timelockPeriod?: InputMaybe<Scalars['BigInt']['input']>;
  timelockPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timelockPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timelockPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timelockPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timelockPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timelockPeriod_not?: InputMaybe<Scalars['BigInt']['input']>;
  timelockPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawalAsset?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_?: InputMaybe<DotcAssetFilter>;
  withdrawalAsset_contains?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_ends_with?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_gt?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_gte?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  withdrawalAsset_lt?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_lte?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_not?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_not_contains?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  withdrawalAsset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_starts_with?: InputMaybe<Scalars['String']['input']>;
  withdrawalAsset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xOrders_?: InputMaybe<XOrderFilter>;
};

export enum XOfferOrderBy {
  AmountIn = 'amountIn',
  AmountOut = 'amountOut',
  AvailableAmount = 'availableAmount',
  Cancelled = 'cancelled',
  CancelledAt = 'cancelledAt',
  CommsLink = 'commsLink',
  CreatedAt = 'createdAt',
  DepositAsset = 'depositAsset',
  DepositAssetAddress = 'depositAsset__address',
  DepositAssetAssetType = 'depositAsset__assetType',
  DepositAssetDecimals = 'depositAsset__decimals',
  DepositAssetId = 'depositAsset__id',
  DepositAssetName = 'depositAsset__name',
  DepositAssetSymbol = 'depositAsset__symbol',
  DepositAssetTokenId = 'depositAsset__tokenId',
  DepositAssetTradedVolume = 'depositAsset__tradedVolume',
  DepositAssetType = 'depositAsset__type',
  ExpiresAt = 'expiresAt',
  Id = 'id',
  IsCompleted = 'isCompleted',
  IsFullType = 'isFullType',
  IsPrivate = 'isPrivate',
  Maker = 'maker',
  Price = 'price',
  SpecialAddresses = 'specialAddresses',
  Terms = 'terms',
  TimelockPeriod = 'timelockPeriod',
  WithdrawalAsset = 'withdrawalAsset',
  WithdrawalAssetAddress = 'withdrawalAsset__address',
  WithdrawalAssetAssetType = 'withdrawalAsset__assetType',
  WithdrawalAssetDecimals = 'withdrawalAsset__decimals',
  WithdrawalAssetId = 'withdrawalAsset__id',
  WithdrawalAssetName = 'withdrawalAsset__name',
  WithdrawalAssetSymbol = 'withdrawalAsset__symbol',
  WithdrawalAssetTokenId = 'withdrawalAsset__tokenId',
  WithdrawalAssetTradedVolume = 'withdrawalAsset__tradedVolume',
  WithdrawalAssetType = 'withdrawalAsset__type',
  XOrders = 'xOrders'
}

export type XOrder = {
  __typename?: 'xOrder';
  amountPaid: Scalars['BigDecimal']['output'];
  amountToReceive: Scalars['BigDecimal']['output'];
  createdAt: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  orderedBy: Scalars['Bytes']['output'];
  xOffer: XOffer;
};

export type XOrderFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountPaid?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountPaid_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountPaid_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountPaid_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountPaid_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountPaid_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountPaid_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountPaid_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountToReceive?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToReceive_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToReceive_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToReceive_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountToReceive_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToReceive_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToReceive_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToReceive_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<XOrderFilter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<XOrderFilter>>>;
  orderedBy?: InputMaybe<Scalars['Bytes']['input']>;
  orderedBy_contains?: InputMaybe<Scalars['Bytes']['input']>;
  orderedBy_gt?: InputMaybe<Scalars['Bytes']['input']>;
  orderedBy_gte?: InputMaybe<Scalars['Bytes']['input']>;
  orderedBy_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  orderedBy_lt?: InputMaybe<Scalars['Bytes']['input']>;
  orderedBy_lte?: InputMaybe<Scalars['Bytes']['input']>;
  orderedBy_not?: InputMaybe<Scalars['Bytes']['input']>;
  orderedBy_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  orderedBy_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  xOffer?: InputMaybe<Scalars['String']['input']>;
  xOffer_?: InputMaybe<XOfferFilter>;
  xOffer_contains?: InputMaybe<Scalars['String']['input']>;
  xOffer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  xOffer_ends_with?: InputMaybe<Scalars['String']['input']>;
  xOffer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xOffer_gt?: InputMaybe<Scalars['String']['input']>;
  xOffer_gte?: InputMaybe<Scalars['String']['input']>;
  xOffer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  xOffer_lt?: InputMaybe<Scalars['String']['input']>;
  xOffer_lte?: InputMaybe<Scalars['String']['input']>;
  xOffer_not?: InputMaybe<Scalars['String']['input']>;
  xOffer_not_contains?: InputMaybe<Scalars['String']['input']>;
  xOffer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  xOffer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  xOffer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xOffer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  xOffer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  xOffer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  xOffer_starts_with?: InputMaybe<Scalars['String']['input']>;
  xOffer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum XOrderOrderBy {
  AmountPaid = 'amountPaid',
  AmountToReceive = 'amountToReceive',
  CreatedAt = 'createdAt',
  Id = 'id',
  OrderedBy = 'orderedBy',
  XOffer = 'xOffer',
  XOfferAmountIn = 'xOffer__amountIn',
  XOfferAmountOut = 'xOffer__amountOut',
  XOfferAvailableAmount = 'xOffer__availableAmount',
  XOfferCancelled = 'xOffer__cancelled',
  XOfferCancelledAt = 'xOffer__cancelledAt',
  XOfferCommsLink = 'xOffer__commsLink',
  XOfferCreatedAt = 'xOffer__createdAt',
  XOfferExpiresAt = 'xOffer__expiresAt',
  XOfferId = 'xOffer__id',
  XOfferIsCompleted = 'xOffer__isCompleted',
  XOfferIsFullType = 'xOffer__isFullType',
  XOfferIsPrivate = 'xOffer__isPrivate',
  XOfferMaker = 'xOffer__maker',
  XOfferPrice = 'xOffer__price',
  XOfferTerms = 'xOffer__terms',
  XOfferTimelockPeriod = 'xOffer__timelockPeriod'
}

export type DotcAssetsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<DotcAssetFilter>;
  block?: InputMaybe<BlockHeight>;
}>;


export type DotcAssetsQuery = { __typename?: 'Query', dotcAssets: Array<{ __typename?: 'DotcAsset', id: string, name: string, decimals?: number | null, symbol: string, address: string, tokenId?: number | null, type: number, assetType?: Sx1155AssetType | null, tradedVolume: string, assetData?: { __typename?: 'KyaData', id: string, location?: string | null, imageURL?: string | null } | null }> };

export type Sx1155TokenIdsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<Sx1155TokenIdFilter>;
}>;


export type Sx1155TokenIdsQuery = { __typename?: 'Query', sx1155TokenIds: Array<{ __typename?: 'SX1155TokenId', id: string, kya: string, assetType?: Sx1155AssetType | null, parentNFT: { __typename?: 'SX1155NFT', name: string, symbol: string, id: string } }> };

export type UserHoldingsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<UserHoldingFilter>;
}>;


export type UserHoldingsQuery = { __typename?: 'Query', userHoldings: Array<{ __typename?: 'UserHolding', id: string, user: { __typename?: 'User', id: string }, tokenId: { __typename?: 'SX1155TokenId', id: string, assetType?: Sx1155AssetType | null, parentNFT: { __typename?: 'SX1155NFT', name: string, symbol: string, id: string } } }> };

export type Volume24hsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<DotcAssetFilter>;
  block?: InputMaybe<BlockHeight>;
}>;


export type Volume24hsQuery = { __typename?: 'Query', currTradedVolume: Array<{ __typename?: 'DotcAsset', id: string, tradedVolume: string }>, prevTradedVolume: Array<{ __typename?: 'DotcAsset', id: string, tradedVolume: string }> };

export type XOffersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<XOfferFilter>;
}>;


export type XOffersQuery = { __typename?: 'Query', xOffers: Array<{ __typename?: 'xOffer', amountIn: string, amountOut: string, availableAmount: string, cancelled: boolean, commsLink: string, createdAt: string, expiresAt: string, id: string, isCompleted: boolean, isFullType: boolean, isPrivate: boolean, maker: string, price: string, specialAddresses: Array<string>, terms: string, timelockPeriod: string, depositAsset: { __typename?: 'DotcAsset', id: string, address: string, tokenId?: number | null, name: string, symbol: string, decimals?: number | null, assetType?: Sx1155AssetType | null, type: number, assetData?: { __typename?: 'KyaData', location?: string | null, id: string } | null, asset?: { __typename?: 'SX1155TokenId', kya: string } | null }, withdrawalAsset: { __typename?: 'DotcAsset', id: string, address: string, tokenId?: number | null, name: string, symbol: string, decimals?: number | null, assetType?: Sx1155AssetType | null, type: number, assetData?: { __typename?: 'KyaData', location?: string | null, id: string } | null, asset?: { __typename?: 'SX1155TokenId', kya: string } | null } }> };


export const DotcAssetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DotcAssets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DotcAsset_filter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"block"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Block_height"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dotcAssets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"block"},"value":{"kind":"Variable","name":{"kind":"Name","value":"block"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"assetData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tradedVolume"}}]}}]}}]} as unknown as DocumentNode<DotcAssetsQuery, DotcAssetsQueryVariables>;
export const Sx1155TokenIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sx1155TokenIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SX1155TokenId_filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sx1155TokenIds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kya"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"parentNFT"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<Sx1155TokenIdsQuery, Sx1155TokenIdsQueryVariables>;
export const UserHoldingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userHoldings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserHolding_filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userHoldings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"parentNFT"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserHoldingsQuery, UserHoldingsQueryVariables>;
export const Volume24hsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Volume24hs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"100"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DotcAsset_filter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"block"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Block_height"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"currTradedVolume"},"name":{"kind":"Name","value":"dotcAssets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tradedVolume"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"prevTradedVolume"},"name":{"kind":"Name","value":"dotcAssets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"block"},"value":{"kind":"Variable","name":{"kind":"Name","value":"block"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tradedVolume"}}]}}]}}]} as unknown as DocumentNode<Volume24hsQuery, Volume24hsQueryVariables>;
export const XOffersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"xOffers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"xOffer_filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"xOffers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountIn"}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"}},{"kind":"Field","name":{"kind":"Name","value":"availableAmount"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}},{"kind":"Field","name":{"kind":"Name","value":"commsLink"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"isFullType"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"maker"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"specialAddresses"}},{"kind":"Field","name":{"kind":"Name","value":"terms"}},{"kind":"Field","name":{"kind":"Name","value":"timelockPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"depositAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"assetData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kya"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"withdrawalAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"assetData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kya"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<XOffersQuery, XOffersQueryVariables>;