import { ReadonlyURLSearchParams } from "next/navigation";

export const createQueryString = (
  searchParams: ReadonlyURLSearchParams,
  keys: string[],
  values: (string | null)[]
) => {
  const params = new URLSearchParams(searchParams.toString());

  keys.forEach((key, index) => {
    if (!values[index]) {
      params.delete(key);
      return;
    }

    params.set(key, String(values[index]));
  });

  return params.toString();
};
