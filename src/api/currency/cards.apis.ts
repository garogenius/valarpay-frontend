import { request } from "@/utils/axios-utils";
import type {
  ICreateCardPayload,
  IUpdateCardPayload,
  IBlockCardPayload,
  ICloseCardPayload,
  IFundCardPayload,
  IWithdrawCardPayload,
  ISetCardLimitsPayload,
  IGetCardTransactionsQuery,
} from "./cards.types";

// Create virtual card
export const createCardRequest = async (data: ICreateCardPayload) => {
  return request({
    url: "/currency/cards",
    method: "post",
    data,
  });
};

// Get all virtual cards
export const getCardsRequest = async () => {
  return request({
    url: "/currency/cards",
    method: "get",
  });
};

// Get card by ID
export const getCardByIdRequest = async (cardId: string) => {
  return request({
    url: `/currency/cards/${cardId}`,
    method: "get",
  });
};

// Update card details
export const updateCardRequest = async (cardId: string, data: IUpdateCardPayload) => {
  return request({
    url: `/currency/cards/${cardId}`,
    method: "patch",
    data,
  });
};

// Block card
export const blockCardRequest = async (cardId: string, data: IBlockCardPayload) => {
  return request({
    url: `/currency/cards/${cardId}/block`,
    method: "post",
    data,
  });
};

// Close card
export const closeCardRequest = async (cardId: string, data: ICloseCardPayload) => {
  return request({
    url: `/currency/cards/${cardId}/close`,
    method: "post",
    data,
  });
};

// Freeze/unfreeze card
export const freezeCardRequest = async (cardId: string, freeze: boolean = true) => {
  return request({
    url: `/currency/cards/${cardId}/freeze?freeze=${freeze}`,
    method: "patch",
  });
};

// Fund card
export const fundCardRequest = async (cardId: string, data: IFundCardPayload) => {
  return request({
    url: `/currency/cards/${cardId}/fund`,
    method: "post",
    data,
  });
};

// Withdraw from card
export const withdrawCardRequest = async (cardId: string, data: IWithdrawCardPayload) => {
  return request({
    url: `/currency/cards/${cardId}/withdraw`,
    method: "post",
    data,
  });
};

// Set card spending limits
export const setCardLimitsRequest = async (cardId: string, data: ISetCardLimitsPayload) => {
  return request({
    url: `/currency/cards/${cardId}/limits`,
    method: "put",
    data,
  });
};

// Get card transactions
export const getCardTransactionsRequest = async (cardId: string, query: IGetCardTransactionsQuery) => {
  const queryParams = new URLSearchParams();
  if (query.limit) queryParams.set("limit", query.limit.toString());
  if (query.offset) queryParams.set("offset", query.offset.toString());
  return request({
    url: `/currency/cards/${cardId}/transactions?${queryParams.toString()}`,
    method: "get",
  });
};



























