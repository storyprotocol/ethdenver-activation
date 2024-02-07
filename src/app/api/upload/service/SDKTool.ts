import { privateKeyToAccount } from "viem/accounts";
import { Chain, Transport, Hex } from "viem";
import { StoryClient, Client } from "@story-protocol/core-sdk";
import {
  CreateIpAssetResponse,
  CreateIpAssetRequest,
} from "@story-protocol/core-sdk";
import {
  CreateIPOrgResponse,
  CreateIPOrgRequest,
} from "@story-protocol/core-sdk";
import {
  RegisterRelationshipTypeRequest,
  RegisterRelationshipTypeResponse,
} from "@story-protocol/core-sdk";
import {
  RegisterRelationshipRequest,
  RegisterRelationshipResponse,
} from "@story-protocol/core-sdk";

export interface RegisterIPOrgParams {
  name: string;
  symbol: string;
  owner?: string;
  assetTypes: string[];
}

export interface RegisterIPOrgRelationTypeParams {
  relType: string;
  ipOrg?: string;
  allowedElements: {
    src: number;
    dst: number;
  };
  allowedSrcs: number[];
  allowedDsts: number[];
}

export interface RegisterIPAssetParams {
  orgAddress: string;
  owner?: string;
  name: string;
  ipAssetType: number;
  hash?: `0x${string}`;
  mediaUrl?: string;
}

export interface RelationshipParams {
  orgAddress: string;
  relType: string;
  srcAddress: string;
  srcId: string;
  dstAddress: string;
  dstId: string;
}

export class SDKTool {
  public accountAddress: string;
  public client: Client;

  constructor(privateKey: Hex, chain?: Chain, transport?: Transport) {
    const account = privateKeyToAccount(privateKey);
    this.client = StoryClient.newClient({
      account,
      chain,
      transport,
    });
    this.accountAddress = account.address;
  }

  public createIPOrg(
    orgItem: RegisterIPOrgParams,
  ): Promise<CreateIPOrgResponse> {
    const params: CreateIPOrgRequest = {
      name: orgItem.name,
      symbol: orgItem.symbol,
      owner: orgItem.owner,
      ipAssetTypes: orgItem.assetTypes,
      txOptions: {
        waitForTransaction: true,
      },
    };
    return this.client.ipOrg.create(params);
  }

  public createIPOrgRelationType(
    item: RegisterIPOrgRelationTypeParams,
  ): Promise<RegisterRelationshipTypeResponse> {
    if (!item.ipOrg) {
      //   fileLogger.error(`The ipOrg field is absent or not provided: ${JSON.stringify(item)}}`);
      throw new Error("The ipOrg field is absent or not provided.");
    }
    const params: RegisterRelationshipTypeRequest = {
      ipOrgId: item.ipOrg,
      relType: item.relType,
      relatedElements: {
        src: item.allowedElements.src,
        dst: item.allowedElements.dst,
      },
      allowedSrcIpAssetTypes: item.allowedSrcs,
      allowedDstIpAssetTypes: item.allowedDsts,
      preHooksConfig: [],
      postHooksConfig: [],
      txOptions: {
        waitForTransaction: true,
      },
    };
    console.log(`params: ${JSON.stringify(params)}`);
    return this.client.relationshipType.register(params);
  }

  public createIPAsset(
    item: RegisterIPAssetParams,
  ): Promise<CreateIpAssetResponse> {
    const params: CreateIpAssetRequest = {
      name: item.name,
      typeIndex: item.ipAssetType,
      ipOrgId: item.orgAddress,
      owner: this.accountAddress,
      mediaUrl: item.mediaUrl,
      contentHash: item.hash,
      txOptions: {
        waitForTransaction: true,
      },
    };
    console.log(`params: ${JSON.stringify(params)}`);
    return this.client.ipAsset.create(params);
  }

  public createRelationship(
    item: RelationshipParams,
  ): Promise<RegisterRelationshipResponse> {
    const params: RegisterRelationshipRequest = {
      ipOrgId: item.orgAddress,
      relType: item.relType,
      srcContract: item.srcAddress,
      srcTokenId: item.srcId,
      dstContract: item.dstAddress,
      dstTokenId: item.dstId,
      preHookData: [],
      postHookData: [],
      txOptions: {
        waitForTransaction: true,
      },
    };
    return this.client.relationship.register(params);
  }

  public async uploadMetadata(content: string): Promise<string> {
    const file = Buffer.from(content);
    const { uri } = await this.client.platform.uploadFile(file, "text/plain");
    return uri;
  }
}
