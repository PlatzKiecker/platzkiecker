export default function Page(props: any) {
  return (
    <div>
      <header className="mb-10">
        <div className="mx-auto max-w-7xl flex justify-between space-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">{props.title}</h1>
          {props.actionItems}
        </div>
      </header>
      <div>{props.children}</div>
    </div>
  );
}
