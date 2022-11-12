import { ArrowSmallLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { HEADER_HEIGHT } from "../../constants";

interface HeaderProps {
  title: string;
  actions?: React.ReactElement;
  backUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ title, backUrl, actions }) => {
  return (
    <header
      style={{ minHeight: HEADER_HEIGHT }}
      className="container flex items-center justify-start p-4"
    >
      {!!backUrl && (
        <Link href={backUrl}>
          <a className="mr-3 cursor-pointer hover:text-indigo-300">
            <ArrowSmallLeftIcon className="h-8 w-8" />
          </a>
        </Link>
      )}
      <h1 className="text-2xl font-medium capitalize text-gray-200">{title}</h1>
      <div className="ml-auto flex gap-3">{actions}</div>
    </header>
  );
};

export default Header;
