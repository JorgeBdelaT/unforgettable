interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="flex min-h-screen justify-center bg-slate-800 text-gray-50">
    <main className="h-screen w-full max-w-screen-md overflow-hidden bg-slate-700 md:w-2/3">
      {children}
    </main>
  </div>
);

export default Layout;
