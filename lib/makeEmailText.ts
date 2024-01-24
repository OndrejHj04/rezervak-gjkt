export default function MakeEmailText(text: any, variables: any) {
  variables.map((item: any) => {
    text = text.replace("${" + item.name + "}", item.value);
  });
  return text;
}
