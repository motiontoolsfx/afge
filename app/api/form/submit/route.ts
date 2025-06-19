import { NextRequest, NextResponse } from 'next/server';
import formJson from '@/data/form.json';
import prisma from '@/lib/prisma';
import { Progress } from '@/app/generated/prisma';

// Form_validation_function
function validateFormData(data: any) {
    const errors: string[] = [];

    formJson.sections.forEach((section: any) => {
        section.questions.forEach((question: any) => {
            const { id, required, options } = question;
            if (required && !data[id]) {
                errors.push(`${question.title} is required.`);
            }

            // Dropdown_validation (check_if_provided_option_is_valid)
            if (options && data[id] && !options.includes(data[id])) {
                errors.push(`${question.title} has an invalid value.`);
            }
        });
    });

    return errors;
}

// POST_handler_to_process_form_submission
export async function POST(req: NextRequest) {
    const { data } = await req.json();

    // Validate_form_data
    const validationErrors = validateFormData(data);
    if (validationErrors.length > 0) {
        return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 });
    }

    try {
        // Create_the_case_entry_dynamically_based_on_the_schema
        const caseEntry = await prisma.case.create({
            data: {
                fname: data.fname,
                lname: data.lname,
                phoneNumber: data.phoneNumber,
                personalEmail: data.personalEmail,
                date: data.date,
                position: data.position, // Ensure_enum_handling_is_correct
                payScale: data.payScale, // Ensure_enum_handling_is_correct
                entitlement: data.entitlement, // Ensure_enum_handling_is_correct
                supervisor: data.supervisor,
                reasonForRequest: data.reasonForRequest, // Ensure_enum_handling_is_correct
                typesOfPayIssue: data.typesOfPayIssue || null,
                typesOfDisciplinaryAction: data.typesOfDisciplinaryAction || null,
                notes: data.notes || "",
                progress: Progress.Not_Started,
            },
        });

        // Return_success_response_with_case_ID
        return NextResponse.json({ message: "Form submitted successfully", caseId: caseEntry.id });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "An error occurred while saving the form data" }, { status: 500 });
    }
}
