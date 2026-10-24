export default function PortalLoading() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="h-6 w-40 rounded bg-skeleton" />
      <div className="h-4 w-64 rounded bg-skeleton" />
      <div className="space-y-3 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-skeleton" />
        ))}
      </div>
    </div>
  );
}
