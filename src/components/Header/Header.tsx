import { HEADER_HEIGHT } from "../../constants";

interface HeaderProps {
  title: string;
  actions?: React.ReactElement;
}

const Header: React.FC<HeaderProps> = ({ title, actions }) => {
  return (
    <header
      style={{ minHeight: HEADER_HEIGHT }}
      className={`bg-greedn-600 container  flex items-start justify-between p-4`}
    >
      <h1 className="text-2xl font-medium text-gray-200">{title}</h1>
      <div className="flex gap-3">{actions}</div>
    </header>
  );
};

export default Header;
