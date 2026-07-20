import { Role } from "../../../generated/prisma/enums";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IjwtPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
}
