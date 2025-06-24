import CasesChart from "../CasesChart/CasesChart";

type Props = {
    // bcases: any; // you can keep AdminCases | undefined if you want
    token: string;
};

export default function AdminManageCases({ token }: Props) {
    return <CasesChart token={token} accountType={'admin'} />;
}