import axios, { AxiosError } from "axios";
import { ErrorResponse as ErrorResponseInterface } from "@/interface/errorResponse";

export class ErrorResponse extends Error implements ErrorResponseInterface {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url, {
      timeout: 16000,
    });

    return res.data;
  } catch (e: AxiosError | any) {
    throw formatError(e);
  }
};

export const formatError = (e: AxiosError | any) => {
  if (e instanceof AxiosError) {
    return new ErrorResponse(
      e?.code || "UNKNOWN",
      e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "An unknown AxiosError occurred",
    );
  }

  return new ErrorResponse(
    e?.code || "UNKNOWN",
    e?.message || "An unknown error occurred",
  );
};
