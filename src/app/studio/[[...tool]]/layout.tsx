export const metadata = {
  title: "Studio | Half Pint Mama",
  description: "Content management studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ height: "100vh", margin: "-1px" }}>
      {children}
    </div>
  );
}
