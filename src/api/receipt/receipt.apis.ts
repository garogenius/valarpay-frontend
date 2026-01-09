import { request } from "@/utils/axios-utils";

export type ReceiptDirection = "credit" | "debit";

export type ReceiptParams = {
  reference: string;
  dateAndTime: string;
  availableBalance: string;
  narration: string;

  // credit endpoint
  senderName?: string;

  // debit endpoint
  receipientName?: string;

  accountNumber: string;
  amount: string;
  accountName: string;
};

export async function getReceiptHtml(direction: ReceiptDirection, params: ReceiptParams) {
  const endpoint = direction === "credit" ? "/receipt/credit" : "/receipt/debit";

  // use query params per backend spec
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    query.set(k, String(v));
  });

  return request({
    url: `${endpoint}?${query.toString()}`,
    method: "get",
    headers: {
      Accept: "text/html",
    },
    responseType: "text",
  }).then((res: any) => res.data as string);
}

































































