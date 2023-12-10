import { Avatar } from "./components/Avatar";

export const Navbar = () => {
  return (
    <div className="flex justify-between items-center ">
      <span>reflectify</span>
      <strong>Team Board</strong>
      <Avatar />
    </div>
  );
};
