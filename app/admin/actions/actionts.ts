"use server";

export const setTheme = async (theme: any, id: any) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/theme`,
    {
      method: "POST",
      body: JSON.stringify({ theme, id }),
    }
  );
  const data = await req.json();
  return data;
};
