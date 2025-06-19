import { PrismaClient, Position, PayScale, Entitlement, ReasonForRequest, PayIssueType, DisciplinaryActionType, Progress } from '../app/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const positions = Object.keys(Position);
const payScales = Object.keys(PayScale);
const entitlements = Object.keys(Entitlement);
const reasons = Object.keys(ReasonForRequest);
const payIssues = [null, ...Object.keys(PayIssueType)];
const disciplinaryActions = [null, ...Object.keys(DisciplinaryActionType)];
const progressStatuses = Object.keys(Progress);

async function main() {
    for (let i = 0; i < 50; i++) {
        const payIssue = payIssues[Math.floor(Math.random() * payIssues.length)];
        const discipline = disciplinaryActions[Math.floor(Math.random() * disciplinaryActions.length)];

        await prisma.case.create({
            data: {
                fname: faker.person.firstName(),
                lname: faker.person.lastName(),
                phoneNumber: faker.phone.number(),
                personalEmail: faker.internet.email(),
                date: faker.date.recent({ days: 180 }).toISOString().split('T')[0],
                position: Position[positions[Math.floor(Math.random() * positions.length)] as keyof typeof Position],
                payScale: PayScale[payScales[Math.floor(Math.random() * payScales.length)] as keyof typeof PayScale],
                entitlement: Entitlement[entitlements[Math.floor(Math.random() * entitlements.length)] as keyof typeof Entitlement],
                supervisor: faker.person.fullName(),
                reasonForRequest: ReasonForRequest[reasons[Math.floor(Math.random() * reasons.length)] as keyof typeof ReasonForRequest],
                typesOfPayIssue: payIssue ? PayIssueType[payIssue as keyof typeof PayIssueType] : undefined,
                typesOfDisciplinaryAction: discipline ? DisciplinaryActionType[discipline as keyof typeof DisciplinaryActionType] : undefined,
                notes: faker.lorem.sentence(),
                progress: Progress[progressStatuses[Math.floor(Math.random() * progressStatuses.length)] as keyof typeof Progress],
            }
        });
    }
}

main()
    .then(() => {
        console.log('Seeding complete');
        return prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        return prisma.$disconnect();
    });
