interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex min-h-screen justify-center bg-slate-800 text-gray-50">
    <main className="w-full max-w-screen-md bg-slate-700 p-4 md:w-2/3">
      {children}
    </main>
  </div>
);

export default Layout;
