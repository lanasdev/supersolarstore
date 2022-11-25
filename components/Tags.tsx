type Props = {
  text: String;
};

export function Tag({ text }: Props) {
  return (
    <span className="inline-flex mx-1 items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-800 text-slate-100">
      {text}
    </span>
  );
}

export default function Tags({ tags }: String[]) {
  return (
    <div className="flex">
      {tags.map((tag) => (
        <Tag key={tag} text={tag} />
      ))}
    </div>
  );
}
