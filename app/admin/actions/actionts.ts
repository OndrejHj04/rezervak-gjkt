"use server";

export const createGroup = async (_: any, formData: any) => {
  const name = formData.get("name");
  const description = formData.get("description");
  const leader = formData.get("leader");

  console.log(name, description, leader);
};
