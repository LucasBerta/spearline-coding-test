import api from "../../core/api";

export function fetchUsers(params) {
  return api.get('/', { params });
}