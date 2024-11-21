import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { DevkitService } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/devkit_service_pb"
import { type Interceptor } from "@connectrpc/connect";
import type { ApiFormError } from "../types/types";

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
    if (error.code == 6) {
      err.fieldErrors[error.rawMessage] = `${error.rawMessage}Unique`
      console.log("field error")
      throw new Error(JSON.stringify(err));
    }
    if (error.code == 13) {
      err.globalErrors = [`${error.rawMessage}`]
      throw new Error(JSON.stringify(err));
    }
    throw new Error(JSON.stringify(err));
  }
}
const transport = createConnectTransport({
  baseUrl: "http://192.168.1.40:9090",
  useHttpGet: true,
  interceptors: [interceptor]
});

export const apiClient = createClient(DevkitService, transport);


