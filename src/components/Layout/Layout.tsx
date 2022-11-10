interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex h-screen min-h-screen justify-center bg-slate-800 text-gray-50 md:p-4">
    <main className="w-full max-w-screen-md overflow-hidden bg-slate-700 md:w-2/3 md:rounded-xl">
      {children}
    </main>
  </div>
);

export default Layout;
