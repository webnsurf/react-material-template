export interface OrganisationCreateData {
  name: string;
  url?: string;
}

export interface AddUserRequest {
  roleId: number;
  email: string;
}

export interface UpdateUserRoleRequest {
  roleId: number;
}
