const getUserData = async (id) => {
  const req = await fetch(`http://localhost:3000/api/users/detail/${id}`);
  const { data } = await req.json();
  return data;
};

export default async function UserDetail({ params: { id } }) {
  const data = await getUserData(id);
  console.log(data);
  return (
    <div>
      <h1>User Detail</h1>
    </div>
  );
}
