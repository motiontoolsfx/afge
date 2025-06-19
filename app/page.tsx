import Form from "./components/Form/Form";
import formJson from "@/data/form.json";
import { FormJson } from "@/types/form";

export default function Home() {
  return (
    <Form formJson={formJson as FormJson} />
  );
}
