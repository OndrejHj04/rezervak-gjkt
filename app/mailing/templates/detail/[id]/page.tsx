import NewTemplate from "@/app/mailing/templates/create/page";
import fetcher from "@/lib/fetcher";
import TemplateForm from "../../TemplateForm";

const getTemplateDetail = async (id: any) => {
  const { data } = (await fetcher(
    `/api/mailing/templates/detail/${id}`
  )) as any;
  return data;
};

export default async function TemplateDetail({
  params: { id },
}: {
  params: { id: any };
}) {
  const template = await getTemplateDetail(id);

  return <TemplateForm template={template} />;
}
