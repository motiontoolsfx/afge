'use client';
import { Role } from "@/app/generated/prisma";
import React, { useState, useEffect } from "react";
import { ArrowDownTrayIcon, DocumentCheckIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";

import styles from './manageUsers.module.css';

type User = {
    id: string;
    fname: string;
    lname: string;
    username: string;
    password: string;
    role: Role;
};

type UserRow = User & { active: boolean };

function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

interface ManageUsersProps {
    users?: { users: User[] };
    token: string;
}

export default function ManageUsers({ users, token }: ManageUsersProps) {
    if (!users || !users.users) {
        return <div>Error loading users</div>;
    }

    const [rows, setRows] = useState<UserRow[]>(() =>
        users?.users?.map((u) => ({ ...u, active: false })) ?? []
    );
    const [originalRows, setOriginalRows] = useState<UserRow[]>(() =>
        users?.users?.map((u) => deepClone({ ...u, active: false })) ?? []
    );
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setHasChanges(
            JSON.stringify(
                rows.map(({ active, ...rest }) => rest)
            ) !==
            JSON.stringify(
                originalRows.map(({ active, ...rest }) => rest)
            )
        );
    }, [rows, originalRows]);

    const handleChange = (
        index: number,
        field: keyof UserRow,
        value: any
    ) => {
        setRows((prev) =>
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        );
    };

    const handleAddUser = () => {
        const newUser: UserRow = {
            id: "",
            fname: "",
            lname: "",
            username: "",
            password: "",
            role: Role.admin,
            active: false,
        };
        setRows((prev) => [...prev, newUser]);
        setOriginalRows((prev) => [...prev, deepClone(newUser)]);
    };

    const isCellChanged = (index: number, field: keyof UserRow) => {
        if (field === "active") return false;
        return (
            JSON.stringify(rows[index][field]) !==
            JSON.stringify(originalRows[index][field])
        );
    };

    const handleSaveChanges = async () => {
        const changedRows = rows
            .map(({ active, ...rest }) => rest)
            .filter((row, index) => {
                const orig = originalRows[index];
                return (
                    JSON.stringify(row) !==
                    JSON.stringify({ ...orig, active: undefined })
                );
            });

        try {
            const res = await fetch("/api/auth/users", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(changedRows),
            });

            if (res.ok) {
                const updated = await res.json();
                const updatedRows = rows.map((row) => {
                    if (!row.id) {
                        const updatedUser = updated.find(
                            (u: User) =>
                                u.username === row.username &&
                                u.fname === row.fname &&
                                u.lname === row.lname
                        );
                        if (updatedUser) {
                            return { ...row, id: updatedUser.id };
                        }
                    }
                    return row;
                });
                setRows(updatedRows);
                setOriginalRows(deepClone(updatedRows));
                setHasChanges(false);
            } else {
                console.error("Failed to update users");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const selectedToDelete = rows
        .filter((r) => r.active && r.id)
        .map((r) => r.id);

    const handleDeleteSelected = async () => {
        for (const id of selectedToDelete) {
            await fetch("/api/auth/users", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
        }
        setRows((prev) => prev.filter((r) => !selectedToDelete.includes(r.id)));
        setOriginalRows((prev) =>
            prev.filter((r) => !selectedToDelete.includes(r.id))
        );
    };

    return (
        <div className={styles.chartContainer}>
            <div className={'chart-tools'}>
                <button className="button-outline button-icon" onClick={handleAddUser}><span>Add User</span><UserPlusIcon /></button>
                <button className="button-solid button-icon" disabled={!hasChanges} onClick={handleSaveChanges}>
                    <span>Save Changes</span><DocumentCheckIcon />
                </button>
                {selectedToDelete.length > 0 && (
                    <button className="button-solid button-icon" onClick={handleDeleteSelected}><span>Delete Selected</span><TrashIcon /></button>
                )}
            </div>

            <table className={'table'}>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((user, index) => (
                        <tr key={user.id || index}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={user.active}
                                    onChange={(e) =>
                                        handleChange(index, "active", e.target.checked)
                                    }
                                />
                            </td>
                            <td className={isCellChanged(index, "fname") ? "chart-changed" : ''}>
                                <input
                                    type="text"
                                    value={user.fname}
                                    onChange={(e) =>
                                        handleChange(index, "fname", e.target.value)
                                    }
                                />
                            </td>
                            <td className={isCellChanged(index, "lname") ? "chart-changed" : ''}>
                                <input
                                    type="text"
                                    value={user.lname}
                                    onChange={(e) =>
                                        handleChange(index, "lname", e.target.value)
                                    }
                                />
                            </td>
                            <td className={isCellChanged(index, "username") ? "chart-changed" : ''}>
                                <input
                                    type="text"
                                    value={user.username}
                                    onChange={(e) =>
                                        handleChange(index, "username", e.target.value)
                                    }
                                />
                            </td>
                            <td className={isCellChanged(index, "password") ? "chart-changed" : ''}>
                                <input
                                    type="text"
                                    value={user.password}
                                    onChange={(e) =>
                                        handleChange(index, "password", e.target.value)
                                    }
                                />
                            </td>
                            <td className={isCellChanged(index, "role") ? "chart-changed" : ''}>
                                <select
                                    value={user.role}
                                    onChange={(e) =>
                                        handleChange(index, "role", e.target.value as Role)
                                    }
                                >
                                    {Object.values(Role).map((r) => (
                                        <option key={r} value={r}>
                                            {r}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
