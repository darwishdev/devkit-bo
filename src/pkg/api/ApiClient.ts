import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { DevkitService } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/devkit_service_pb"
import { type Interceptor } from "@connectrpc/connect";
import type { ApiFormError } from "../types/types";
import { Code } from "@connectrpc/connect";
const interceptor: Interceptor = (next) => async (req) => {
  try {
    const token = localStorage.getItem("token") as string
    req.header.append("Authorization", `bearer ${token}`)
    const response = await next(req);
    return response
  } catch (error: any) {
    const err: ApiFormError = {
      globalErrors: [],
      fieldErrors: {}
    }
    console.log("eror code", error.code)
    if (error.code == Code.AlreadyExists) {
      err.fieldErrors[error.rawMessage] = `${error.rawMessage}Unique`
      console.log("field error")
      throw new Error(JSON.stringify(err));
    }
    err.globalErrors = [`${error.rawMessage}`]
    const errStr = JSON.stringify(err)
    console.log("error is ", errStr)
    throw new Error(errStr);
  }
}
const transport = createConnectTransport({
  baseUrl: import.meta.env.VITE_API_URL,
  useHttpGet: true,
  interceptors: [interceptor]
});

export const apiClient = createClient(DevkitService, transport);
