export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="m-0 p-0 w-screen h-screen" style={{ margin: 0, padding: 0 }}>{children}</div>;
}
