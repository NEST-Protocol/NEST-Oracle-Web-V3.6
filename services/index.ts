/**
 * 交易对数据结构
 */
export interface IPariItem {
    symbol: string;
    address?: string;
    nAddress?: string;
}

 export interface IVotingItem {
  brief?: string;
  contractAddress: string;
  nestCirculation: any;
  startTime: number;
  stopTime: number;
  gainValue: any;
  index: number;
}