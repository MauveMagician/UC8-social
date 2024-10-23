import Conta from "@/app/conta";

export async function getServerSideProps(context) {
  const { handle } = context.params;

  try {
    const res = await fetch(`${process.env.HOST}/api/users/${handle}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }
    const user = await res.json();

    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: { user }, // Pass the user data to the page component
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default function Contausers({ user }) {
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <>
      <Conta user_id={user.user_id} />
    </>
  );
}
