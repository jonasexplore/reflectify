import Image from "next/image";

export const Avatar = () => {
  return (
    <div className="flex gap-2 items-center">
      <span className="font-semibold">Jonas Brito</span>
      <Image
        className="rounded-full"
        width={32}
        height={32}
        alt="profile"
        src="https://avatars.githubusercontent.com/u/53955982?v=4"
      />
    </div>
  );
};
