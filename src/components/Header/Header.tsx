interface HeaderProps {
  title: string;
  actions?: React.ReactElement;
}

const Header: React.FC<HeaderProps> = ({ title, actions }) => {
  return (
    <div className="container mb-16 flex items-center justify-between">
      <h1 className="text-2xl font-medium text-gray-200">{title}</h1>
      {actions}
    </div>
  );
};

export default Header;
