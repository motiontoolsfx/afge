import { Case } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import HeadersWithFilters from "../HeadersWithFilters/HeadersWithFilters";
import { Filters } from "@/types/dashboard";
import EditableChart from "../EditableChart/EditableChart";

type Props = {
    bcases: any; // you can keep AdminCases | undefined if you want
    token: string;
};

interface Cases {
    chartData: Case[];
    filters: {};
    page: number;
    totalPages: number;
    total: number;
    users: string[];
}

const caseChartData = {
    user: {
        headerName: "Steward",
        cellType: "userDropdown" as const,
        editable: true,
        options: {}
    },
    progress: {
        headerName: "Progress",
        cellType: "dropdown" as const,
        editable: true,
        options: {
            Not_Started: "Not Started",
            In_Progress: "In Progress",
            Meeting_Set: "Meeting Set",
            Awaiting_Response: "Awaiting Response",
            Esculated: "Escalated",
            Complete: "Complete",
        }
    },
    notes: {
        headerName: "Notes",
        cellType: "text" as const,
        editable: true
    },
    fname: {
        headerName: "First",
        cellType: "text" as const,
        editable: true
    },
    lname: {
        headerName: "Last",
        cellType: "text" as const,
        editable: true
    },
    phoneNumber: {
        headerName: "Phone Number",
        cellType: "text" as const,
        editable: true
    },
    personalEmail: {
        headerName: "Email",
        cellType: "text" as const,
        editable: true
    },
    date: {
        headerName: "Date",
        cellType: "date" as const,
        editable: true
    },
    position: {
        headerName: "Position",
        cellType: "dropdown" as const,
        editable: true,
        options: {
            Nurse: "Nurse",
            MAS: "MAS",
            FMS: "FMS",
            EMS: "EMS",
            HIMS: "HIMS",
            Doctor: "Doctor",
            Tech: "Tech",
            LPN: "LPN",
            Social_Work: "Social Work",
            Dentist: "Dentist",
            Dental_Assistant: "Dental Assistant",
            Other: "Other",
        }
    },
    payScale: {
        headerName: "Pay Scale",
        cellType: "dropdown" as const,
        editable: true,
        options: {
            GS: "GS",
            WG: "WG",
            VN: "VN",
        }
    },
    entitlement: {
        headerName: "Entitlement",
        cellType: "dropdown" as const,
        editable: true,
        options: {
            Title_38: "Title 38",
            Title_5: "Title 5",
            Hybrid: "Hybrid",
            Unknown: "Unknown",
        }
    },
    supervisor: {
        headerName: "Supervisor",
        cellType: "text" as const,
        editable: true
    },
    reasonForRequest: {
        headerName: "Reason For Request",
        cellType: "dropdown" as const,
        editable: true,
        options: {
            Fact_Finding: "Fact Finding",
            Pay_Issues: "Pay Issues",
            Performance_Appraisal: "Performance Appraisal",
            EEO: "EEO",
            Grievance: "Grievance",
            Change_in_Working_Condition: "Change in Working Condition",
            Reasonable_Accommodation_RA: "Reasonable Accommodation (RA)",
            Workers_Compensation: "Workers Compensation",
            Disciplinary_Action: "Disciplinary Action",
            Other: "Other",
        }
    },
    typesOfPayIssue: {
        headerName: "Type of Pay Issue",
        cellType: "dropdown" as const,
        editable: true,
        options: {
            Indebtedness: "Indebtedness",
            Pay_check: "Pay Check",
        }
    },
    typesOfDisciplinaryAction: {
        headerName: "Types of Disciplinary Action",
        cellType: "dropdown" as const,
        editable: true,
        options: {
            Verbal_Counseling: "Verbal Counseling",
            Written_Counseling: "Written Counseling",
            Admonishment: "Admonishment",
            Reprimand: "Reprimand",
            Proposed_Suspension: "Proposed Suspension",
            Proposed_Removal: "Proposed Removal",
        }
    }
}

export default function AdminManageCases({ bcases, token }: Props) {
    const [cases, setCases] = useState<Cases | null>(null);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Filters>({
        where: {},
        orderBy: {},
    });

    async function fetchCases(p = page, f = filters) {
        try {
            const res = await fetch(`/api/user/cases`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ page: p, filters: f }),
            });

            if (res.ok) {
                const data = await res.json();
                setCases({ ...data, chartData: data.data });
            } else {
                console.error("Failed to fetch cases");
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchCases(page, filters);
    }, [page, filters]);

    function changePage(newPage: number) {
        if (cases && newPage >= 1 && newPage <= cases.totalPages) {
            setPage(newPage);
            fetchCases(newPage, filters);
        }
    }

    function changeFilters(newFilters: Filters) {
        setFilters(newFilters);
        setPage(1);
        fetchCases(1, newFilters);
    }

    async function handleChartSave(updated: Case[]) {
        // build the payload to match your PATCH handler signature
        console.log(updated);

        const payload = updated.map((u) => ({
            id: String(u.id),
            fname: u.fname,
            lname: u.lname,
            username: u.personalEmail,  // or whatever your “username” field is
            password: "",               // you probably need to prompt/reset this
            role: u.position as any,    // cast to Role if necessary
        }));

        const res = await fetch("/api/cases", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            console.error("Failed to save: ", await res.text());
            return;
        }

        // if successful, update local state so “Save” button goes back to disabled
        // setCases(updated);
    }

    return (
        <div>
            <div>Save Delete Print</div>
            {cases && (
                <div key={JSON.stringify(cases.chartData)}>
                    <EditableChart
                        headerRow={<HeadersWithFilters chartData={caseChartData} users={cases?.users} filters={filters} setFilters={setFilters} onFiltersChange={changeFilters} />}
                        chartData={cases.chartData}
                        chartConfig={caseChartData}
                        users={cases.users}
                        onChange={(updated) =>
                            // setCases((c) => (c ? { ...c, chartData: updated } : c))
                            handleChartSave(updated)
                        }
                    />
                </div>
            )}
            {cases && (
                <Pagination
                    page={cases.page}
                    totalPages={cases.totalPages}
                    totalCases={cases.total}
                    onPageChange={changePage}
                />
            )}
        </div>
    );
}