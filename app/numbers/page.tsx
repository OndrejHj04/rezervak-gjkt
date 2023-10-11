import Link from "next/link";
import MakeIncrement from "./MakeIncrement";

const getCount = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/numbers`);
  const { data } = await req.json();

  return data[0];
};

export default async function NumbersPage() {
  const { count } = await getCount();

  return (
    <div>
      test: {count} <MakeIncrement />
    </div>
  );
}
