export default function Card(props: React.PropsWithChildren<{}>) {
  return (
    <div className="rounded-lg bg-white shadow-md p-4 max-w-xl">
      {props.children}
    </div>
  );
}
