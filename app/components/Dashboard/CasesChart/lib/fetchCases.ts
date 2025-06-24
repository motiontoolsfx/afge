export async function fetchCases(token: string, page: number, filters: any, accountType: string) {
    const res = await fetch(`/api/user/cases`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ page, filters, accountType }),
    });

    if (!res.ok) throw new Error("Failed to fetch cases");
    return res.json();
}
