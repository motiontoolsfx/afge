import { NextRequest, NextResponse } from 'next/server';
import formJson from '@/data/form.json';
import prisma from '@/lib/prisma';
import { Progress } from '@/app/generated/prisma';
import { put } from '@vercel/blob';

// Form_validation_function
function validateFormData(data: any) {
    const errors: string[] = [];

    formJson.sections.forEach((section: any) => {
        section.questions.forEach((question: any) => {
            const { id, required, options, type, maxFileSize, title } = question;
            const value = data.get(id);

            if (required && (value === null || value === undefined || value === "")) {
                errors.push(`${title} is required`);
                return;
            }

            if (!value) return; // skip validation if no value and not required

            if (type === "short_answer") {
                if (typeof value !== "string" || value.length < 1 || value.length > 50) {
                    errors.push(`${title} must be between 1 and 50 characters`);
                }
            } else if (type === "dropdown") {
                const validIds = options.map((opt: any) => opt.id);
                if (!validIds.includes(value)) {
                    errors.push(`${title} has an invalid option selected`);
                }
            } else if (type === "long_answer") {
                if (typeof value !== "string" || value.length < 1 || value.length > 400) {
                    errors.push(`${title} must be between 1 and 400 characters`);
                }
            } else if (type === "file") {
                if (value instanceof File) {
                    if (value.size / (1024 * 1024) > maxFileSize) {
                        errors.push(`${title} must be less than or equal to ${maxFileSize} megabytes`);
                    }
                } else {
                    errors.push(`${title} must be a file`);
                }
            }
        });
    });

    return errors;
}

// POST_handler_to_process_form_submission
export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
        return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 });
    }

    try {
        const dataObj: Record<string, any> = {};

        for (const section of formJson.sections) {
            for (const question of section.questions) {
                const { id, type } = question;
                let value = formData.get(id);

                if (value === null) {
                    dataObj[id] = null;
                    continue;
                }

                if (type === "file") {
                    if (value instanceof File) {
                        const ext = value.name.split('.').pop() || 'bin';
                        const blob = await put(`${crypto.randomUUID()}.${ext}`, value, { access: 'public' });
                        dataObj[id] = blob.url; // save the URL string in DB
                    } else {
                        dataObj[id] = null;
                    }
                    continue;
                }

                dataObj[id] = typeof value === "string" ? value.trim() : value;
            }
        }

        dataObj.progress = Progress.Not_Started;

        const caseEntry = await prisma.case.create({ data: dataObj as any });

        return NextResponse.json({ message: "Form submitted successfully", caseId: caseEntry.id });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred while saving the form data" }, { status: 500 });
    }
}