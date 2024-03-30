import TemplateForm from "../../TemplateForm";
import { malingTemplateDetail } from "@/lib/api";

export default async function TemplateDetail({
  params: { id },
}: {
  params: { id: any };
}) {
  const template = await malingTemplateDetail({ id });

  return <TemplateForm template={template} />;
}
