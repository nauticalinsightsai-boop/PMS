export default function SocialMediaManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-mx-4 -mt-4 min-h-0 flex-1 bg-background text-foreground md:-mx-8 md:-mt-6">
      {children}
    </div>
  );
}
