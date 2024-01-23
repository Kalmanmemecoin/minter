import { Address, Cell, TonClient, TonClient4 } from "ton";
import BN from "bn.js";

function _prepareParams(params: any[] = []) {
  return params.map((p) => {
    if (p instanceof Cell) {
      return ["tvm.Slice", p.toBoc({ idx: false }).toString("base64")];
    } else if (p instanceof BN) {
      return ["num", p.toString(10)];
    }

    throw new Error("unknown type!");
  });
}

export type GetResponseValue = Cell | BN | null;

export function cellToAddress(s: GetResponseValue): Address {
  return (s as Cell).beginParse().readAddress() as Address;
}

function _parseGetMethodCall(stack: [["num" | "cell" | "list", any]]): GetResponseValue[] {
  return stack.map(([type, val]) => {
    switch (type) {
      case "num":
        return new BN(val.replace("0x", ""), "hex");
      case "cell":
        return Cell.fromBoc(Buffer.from(val.bytes, "base64"))[0];
      case "list":
        if (val.elements.length === 0) {
          return null;
        } else {
          throw new Error("list parsing not supported");
        }
      default:
        throw new Error(`unknown type: ${type}, val: ${JSON.stringify(val)}`);
    }
  });
}

export async function makeGetCall<T>(
  address: Address | undefined,
  name: string,
  params: any[],
  parser: (stack: GetResponseValue[]) => T,
  tonClient: TonClient,
) {
  const { stack } = await tonClient.callGetMethod(address!, name, _prepareParams(params));

  return parser(_parseGetMethodCall(stack as [["num" | "cell", any]]));
}

export async function makeGetCall4<T>(
  address: Address | undefined,
  name: string,
  params: any[],
  parser: (stack: GetResponseValue[]) => T,
  tonClient: TonClient4,
) {
  const {
    last: { seqno },
  } = await tonClient.getLastBlock();
  const res = await tonClient.runMethod(seqno, address!, name, params);
  // const some = await tonClient.runMethod(seqno, address!, name, _prepareParams(params));

  // @ts-ignore
  console.log(res.result.map(({ value, cell }) => value ?? cell));

  // @ts-ignore
  return parser(_parseGetMethodCall(res.result.map(({ value, cell }) => value ?? cell)));
}
