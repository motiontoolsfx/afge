// import { StewardCases as StewardCasesType } from "@/types/dashboard";
import CasesChart from "../CasesChart/CasesChart";

interface Props {
    token: string;
}

export default function StewardCases({ token }: Props) {
    return <CasesChart token={token} accountType={'steward'} />;
}