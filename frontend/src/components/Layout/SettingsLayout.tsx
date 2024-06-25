function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-12">{children}</div>;
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
}

SettingsLayout.Section = Section;
export default SettingsLayout;
