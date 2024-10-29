import { RegistrationStatus } from "@prisma/client";

export const closedRegistrationStatus: RegistrationStatus[] = [RegistrationStatus.HANDLED, RegistrationStatus.SKIPPED, RegistrationStatus.WITHDRAWN]
