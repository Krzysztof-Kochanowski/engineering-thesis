export enum Role {
  THERAPIST = 'THERAPIST',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export type RoleLang = {
  [key in Role]: string;
};

export function isAdmin(role: string): boolean {
  return (role as Role) == Role.ADMIN;
}
