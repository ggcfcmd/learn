async function MockGetBlogDetailFromDataBase(id: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: "aaa",
        content: "bbb",
      });
    }, 3000);
  });
}

export default async function OneBlog({ params }: { params: { id: string } }) {
  const blog = (await MockGetBlogDetailFromDataBase(params.id)) as any;

  return (
    <div>
      <h1 className="text-3xl">{blog.title}</h1>
      <p>{blog.content}</p>
    </div>
  );
}
