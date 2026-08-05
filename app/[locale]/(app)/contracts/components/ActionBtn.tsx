export const ActionBtn = ({
  icon: Icon,
  title,
  onClick,
  isNeutral = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => (
  <button
    onClick={onClick}
    title={title}
    className={` p-1.5 hover:bg-white rounded-md transition-all cursor-pointer ${isNeutral ? "text-slate-600" : "text-indigo-600"}`}
  >
    <Icon className="w-4 h-4" />
  </button>
);
