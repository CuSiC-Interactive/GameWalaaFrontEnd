import SHA512 from "crypto-js/sha512";

export const generatePayUHash = (
  key: string,
  txnid: string,
  amount: string,
  productinfo: string,
  firstname: string,
  email: string,
  salt: string
): string => {
  const str = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  return SHA512(str).toString();
};